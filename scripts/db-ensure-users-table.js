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
      CREATE TABLE IF NOT EXISTS ${schema}.users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password_hash TEXT,
        password_salt TEXT,
        email_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pg.query(`CREATE INDEX IF NOT EXISTS users_email_idx ON ${schema}.users(email)`);
    console.log("Users table ensured.");
  } catch (e) {
    console.error("Ensure users table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();