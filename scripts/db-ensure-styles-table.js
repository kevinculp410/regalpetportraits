import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    await pg.query(`
      CREATE TABLE IF NOT EXISTS pet_portraits.styles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        preview_url TEXT NOT NULL,
        s3_key TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pg.query(`CREATE INDEX IF NOT EXISTS styles_active_sort_idx ON pet_portraits.styles(is_active, sort_order)`);
    console.log("Styles table ensured.");
  } catch (e) {
    console.error("Ensure styles table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();