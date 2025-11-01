import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`
      ALTER TABLE pet_portraits.jobs
      ADD COLUMN IF NOT EXISTS composite_upscaled_url TEXT;
    `);
    console.log("Migration complete: pet_portraits.jobs.composite_upscaled_url added (if not exists)");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();