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
      CREATE TABLE IF NOT EXISTS ${schema}.login_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        user_id UUID NOT NULL REFERENCES ${schema}.users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
    await pg.query(`CREATE INDEX IF NOT EXISTS login_tokens_token_idx ON ${schema}.login_tokens(token)`);
    await pg.query(`CREATE INDEX IF NOT EXISTS login_tokens_user_id_idx ON ${schema}.login_tokens(user_id)`);
    console.log("Login tokens table ensured.");
  } catch (e) {
    console.error("Ensure login_tokens table failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();