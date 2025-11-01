import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS upload_s3_key TEXT,
      ADD COLUMN IF NOT EXISTS result_s3_key TEXT,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
    `);
    console.log("Migration complete: jobs.upload_s3_key, jobs.result_s3_key, jobs.completed_at added (if not exists)");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();