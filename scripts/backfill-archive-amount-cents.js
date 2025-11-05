import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

/**
 * Backfill pet_portraits.jobs_archive.amount_cents using values from pet_portraits.jobs.amount_cents.
 *
 * Usage:
 *   node scripts/backfill-archive-amount-cents.js --dry-run   # show counts, no updates
 *   node scripts/backfill-archive-amount-cents.js             # perform update
 */
(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  const dryRun = process.argv.includes("--dry-run");

  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    // Ensure column exists on archive table
    await pg.query(`
      CREATE TABLE IF NOT EXISTS pet_portraits.jobs_archive (
        job_id UUID PRIMARY KEY,
        user_id UUID,
        user_name TEXT,
        user_email TEXT,
        style_id TEXT,
        style_name TEXT,
        status TEXT,
        prompt_text TEXT,
        amount_cents NUMERIC(10,2),
        upload_s3_key TEXT,
        result_s3_key TEXT,
        composite_s3_key TEXT,
        result_s3_key_upscaled TEXT,
        composite_upscaled_url TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ,
        completed_at TIMESTAMPTZ,
        archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pg.query(`ALTER TABLE pet_portraits.jobs_archive ADD COLUMN IF NOT EXISTS amount_cents NUMERIC(10,2)`);

    // How many archive rows need backfilling and have a source amount on jobs
    const countRes = await pg.query(`
      SELECT COUNT(*) AS cnt
      FROM pet_portraits.jobs_archive ja
      JOIN pet_portraits.jobs j ON j.id = ja.job_id
      WHERE (ja.amount_cents IS NULL OR ja.amount_cents = 0)
        AND j.amount_cents IS NOT NULL
    `);
    const toUpdate = Number(countRes.rows?.[0]?.cnt || 0);

    // Optional preview sample
    const sampleRes = await pg.query(`
      SELECT ja.job_id, ja.amount_cents AS archive_amount, j.amount_cents AS job_amount
      FROM pet_portraits.jobs_archive ja
      JOIN pet_portraits.jobs j ON j.id = ja.job_id
      WHERE (ja.amount_cents IS NULL OR ja.amount_cents = 0)
        AND j.amount_cents IS NOT NULL
      ORDER BY ja.job_id ASC
      LIMIT 10
    `);

    console.log(JSON.stringify({
      dryRun,
      toUpdate,
      sample: sampleRes.rows
    }, null, 2));

    if (dryRun) {
      console.log("[DRY] No changes applied.");
      await pg.end();
      return;
    }

    await pg.query("BEGIN");
    const updateRes = await pg.query(`
      UPDATE pet_portraits.jobs_archive ja
      SET amount_cents = j.amount_cents
      FROM pet_portraits.jobs j
      WHERE ja.job_id = j.id
        AND (ja.amount_cents IS NULL OR ja.amount_cents = 0)
        AND j.amount_cents IS NOT NULL
    `);
    await pg.query("COMMIT");

    console.log(JSON.stringify({ updated_rows: updateRes.rowCount }, null, 2));
  } catch (e) {
    try { await pg.query("ROLLBACK"); } catch (_) {}
    console.error("BACKFILL_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();