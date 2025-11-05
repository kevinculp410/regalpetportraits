import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
import { randomBytes, scryptSync } from "crypto";
const schema = process.env.DB_SCHEMA || "pet_portraits";

async function ensureAdminsTable() {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
    await pg.query(`
      CREATE TABLE IF NOT EXISTS ${schema}.admins (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        user_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create index on email for fast lookup
    await pg.query(`CREATE INDEX IF NOT EXISTS admins_email_idx ON ${schema}.admins (email);`);

    // Seed admin account if not exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const existing = await pg.query(`SELECT id FROM ${schema}.admins WHERE email = $1`, [adminEmail]);
    if (!existing.rowCount) {
      const salt = randomBytes(16).toString("hex");
      const password = process.env.ADMIN_SEED_PASSWORD || "TempAdmin_123!"; // share with user
      const hash = scryptSync(password, salt, 64).toString("hex");

      // Ensure a corresponding users row exists for cookie compatibility
      let userId = null;
      const u = await pg.query(`SELECT id FROM ${schema}.users WHERE email = $1`, [adminEmail]);
      if (u.rowCount) {
        userId = u.rows[0].id;
      } else {
        const nu = await pg.query(
          `INSERT INTO ${schema}.users (id, email, name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING id`,
          [adminEmail, "Admin"]
        );
        userId = nu.rows[0].id;
      }

      await pg.query(
        `INSERT INTO ${schema}.admins (email, password_hash, password_salt, user_id) VALUES ($1, $2, $3, $4)`,
        [adminEmail, hash, salt, userId]
      );

      console.log(`Seeded admin account for ${adminEmail}.`);
      if (!process.env.ADMIN_SEED_PASSWORD) {
        console.log("Admin seed password:", password);
      }
    } else {
      console.log("Admin account already exists for:", adminEmail);
    }
  } finally {
    await pg.end();
  }
}

ensureAdminsTable().then(() => {
  console.log("Admins table ensured.");
}).catch(err => {
  console.error(err);
  process.exit(1);
});