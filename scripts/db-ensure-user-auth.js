import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    // Add password authentication columns to users table
    await pg.query(`
      ALTER TABLE pet_portraits.users 
      ADD COLUMN IF NOT EXISTS password_hash TEXT,
      ADD COLUMN IF NOT EXISTS password_salt TEXT,
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE
    `);
    
    // Create email verification tokens table
    await pg.query(`
      CREATE TABLE IF NOT EXISTS pet_portraits.email_verification_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token TEXT UNIQUE NOT NULL,
        user_id UUID NOT NULL REFERENCES pet_portraits.users(id) ON DELETE CASCADE,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    
    // Create index for faster token lookups
    await pg.query(`CREATE INDEX IF NOT EXISTS email_verification_tokens_token_idx ON pet_portraits.email_verification_tokens(token)`);
    await pg.query(`CREATE INDEX IF NOT EXISTS email_verification_tokens_user_id_idx ON pet_portraits.email_verification_tokens(user_id)`);
    
    console.log("User authentication tables ensured successfully.");
    
  } catch (e) {
    console.error("Migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();