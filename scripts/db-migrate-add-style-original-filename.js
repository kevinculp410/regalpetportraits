import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`ALTER TABLE styles ADD COLUMN IF NOT EXISTS original_filename TEXT`);
    console.log("Migration complete: styles.original_filename added (if not exists)");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();