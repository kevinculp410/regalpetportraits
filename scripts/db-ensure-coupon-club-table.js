import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
const schema = process.env.DB_SCHEMA || "pet_portraits";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    try { await pg.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`); } catch (_) {}
    await pg.query(`
      CREATE TABLE IF NOT EXISTS ${schema}.coupon_club (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pg.query(`CREATE INDEX IF NOT EXISTS coupon_club_email_idx ON ${schema}.coupon_club(email)`);
    console.log("Coupon club table ensured.");
  } catch (e) {
    console.error("Ensure coupon_club table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();