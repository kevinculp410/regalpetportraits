import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
const schema = process.env.DB_SCHEMA || "pet_portraits";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    // pgcrypto for gen_random_uuid(); ignore failure if not permitted
    try { await pg.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`); } catch (_) {}

    await pg.query(`
      CREATE TABLE IF NOT EXISTS ${schema}.jobs_archive (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID NOT NULL,
        user_id UUID NOT NULL,
        user_name TEXT,
        user_email TEXT,
        style_id TEXT,
        style_name TEXT,
        style_title TEXT,
        style_preview_url TEXT,
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

    // Ensure new columns exist on existing deployments
    await pg.query(`ALTER TABLE ${schema}.jobs_archive ADD COLUMN IF NOT EXISTS style_title TEXT`);
    await pg.query(`ALTER TABLE ${schema}.jobs_archive ADD COLUMN IF NOT EXISTS style_preview_url TEXT`);

    await pg.query(`CREATE INDEX IF NOT EXISTS jobs_archive_job_id_idx ON ${schema}.jobs_archive(job_id)`);
    await pg.query(`CREATE INDEX IF NOT EXISTS jobs_archive_user_id_idx ON ${schema}.jobs_archive(user_id)`);
    await pg.query(`CREATE INDEX IF NOT EXISTS jobs_archive_archived_at_idx ON ${schema}.jobs_archive(archived_at)`);
    await pg.query(`CREATE INDEX IF NOT EXISTS jobs_archive_created_at_idx ON ${schema}.jobs_archive(created_at)`);

    console.log("Jobs archive table ensured.");
  } catch (e) {
    console.error("Ensure jobs_archive table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();