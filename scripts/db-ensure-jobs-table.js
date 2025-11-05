import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
const schema = process.env.DB_SCHEMA || "pet_portraits";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    await pg.query(`
      CREATE TABLE IF NOT EXISTS ${schema}.jobs (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        style_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'created',
        prompt_text TEXT,
      amount_cents NUMERIC(10,2),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        archived_at TIMESTAMPTZ
      );
    `);
    // Ensure column exists for already-created tables
    await pg.query(`ALTER TABLE ${schema}.jobs ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ`);
    await pg.query(`CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON ${schema}.jobs(user_id)`);
    console.log("Jobs table ensured.");
  } catch (e) {
    console.error("Ensure jobs table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();