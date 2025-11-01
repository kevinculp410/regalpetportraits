import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    await pg.query(`
      CREATE TABLE IF NOT EXISTS pet_portraits.jobs (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL,
        style_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'created',
        prompt_text TEXT,
        amount_cents INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pg.query(`CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON pet_portraits.jobs(user_id)`);
    console.log("Jobs table ensured.");
  } catch (e) {
    console.error("Ensure jobs table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();