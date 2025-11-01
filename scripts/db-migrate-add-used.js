import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`ALTER TABLE login_tokens ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT FALSE`);
    console.log("Migration complete: login_tokens.used added (if not exists)");
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();