import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

/**
 * Migration: Convert amount_cents columns from INTEGER cents to NUMERIC dollars.
 * - Alters column types on pet_portraits.jobs and pet_portraits.jobs_archive to NUMERIC(10,2)
 * - If the prior data type was integer, divides existing values by 100.0 to store dollars
 *
 * Usage:
 *   node scripts/db-migrate-amount-cents-to-dollars.js --dry-run   # preview planned changes
 *   node scripts/db-migrate-amount-cents-to-dollars.js             # apply changes
 */
(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  const dryRun = process.argv.includes("--dry-run");

  async function getColumnType(schema, table, column) {
    const r = await pg.query(
      `SELECT data_type FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
      [schema, table, column]
    );
    return r.rows[0]?.data_type || null;
  }

  async function alterToNumeric(schema, table, column) {
    await pg.query(
      `ALTER TABLE ${schema}.${table} ALTER COLUMN ${column} TYPE NUMERIC(10,2) USING (${column}::numeric)`
    );
  }

  async function divideBy100(schema, table, column) {
    await pg.query(
      `UPDATE ${schema}.${table} SET ${column} = (${column} / 100.0) WHERE ${column} IS NOT NULL`
    );
  }

  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);

    const targets = [
      { schema: 'pet_portraits', table: 'jobs', column: 'amount_cents' },
      { schema: 'pet_portraits', table: 'jobs_archive', column: 'amount_cents' }
    ];

    const plan = [];
    for (const t of targets) {
      const typeBefore = await getColumnType(t.schema, t.table, t.column);
      plan.push({ ...t, typeBefore });
    }

    if (dryRun) {
      console.log(JSON.stringify({ dryRun, plan }, null, 2));
      await pg.end();
      return;
    }

    await pg.query('BEGIN');
    for (const t of plan) {
      // Ensure table exists before altering
      await pg.query(`CREATE TABLE IF NOT EXISTS ${t.schema}.${t.table} (dummy_col INTEGER)`);
      await alterToNumeric(t.schema, t.table, t.column);
      // If previous type was integer, convert values from cents to dollars
      if (t.typeBefore && t.typeBefore.toLowerCase().includes('integer')) {
        await divideBy100(t.schema, t.table, t.column);
      }
    }
    await pg.query('COMMIT');

    const after = [];
    for (const t of targets) {
      const typeAfter = await getColumnType(t.schema, t.table, t.column);
      const sample = await pg.query(
        `SELECT ${t.column} FROM ${t.schema}.${t.table} WHERE ${t.column} IS NOT NULL ORDER BY 1 DESC LIMIT 3`
      );
      after.push({ ...t, typeAfter, sample: sample.rows });
    }
    console.log(JSON.stringify({ dryRun: false, result: after }, null, 2));
  } catch (e) {
    try { await pg.query('ROLLBACK'); } catch (_) {}
    console.error('MIGRATION_ERROR', e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();