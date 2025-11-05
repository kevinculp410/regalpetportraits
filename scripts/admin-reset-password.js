import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";
import { randomBytes, scryptSync, randomUUID } from "crypto";
const schema = process.env.DB_SCHEMA || "pet_portraits";

(async () => {
  const email = process.env.ADMIN_RESET_EMAIL || "blueskyaiaa@gmail.com";
  const newPassword = process.env.ADMIN_RESET_PASSWORD || "Regal";

  if (!email || !newPassword) {
    console.error("Missing ADMIN_RESET_EMAIL or ADMIN_RESET_PASSWORD env vars.");
    process.exit(1);
  }

  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();

  try {
    const existing = await pg.query(
      `SELECT id, email, user_id FROM ${schema}.admins WHERE email = $1`,
      [email]
    );

    const salt = randomBytes(16).toString("hex");
    const hash = scryptSync(newPassword, salt, 64).toString("hex");

    if (existing.rowCount) {
      const admin = existing.rows[0];
      await pg.query(
        `UPDATE ${schema}.admins SET password_hash = $1, password_salt = $2, updated_at = NOW() WHERE id = $3`,
        [hash, salt, admin.id]
      );
      console.log(`Admin password reset for ${email}.`);
    } else {
      // Ensure a corresponding users row exists
      let userId = null;
      const u = await pg.query(`SELECT id FROM ${schema}.users WHERE email = $1`, [email]);
      if (u.rowCount) {
        userId = u.rows[0].id;
      } else {
        userId = randomUUID();
        await pg.query(
          `INSERT INTO ${schema}.users (id, email, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())`,
          [userId, email, "Admin"]
        );
      }

      await pg.query(
        `INSERT INTO ${schema}.admins (email, password_hash, password_salt, user_id) VALUES ($1, $2, $3, $4)`,
        [email, hash, salt, userId]
      );
      console.log(`Admin did not exist; created and set password for ${email}.`);
    }
  } catch (e) {
    console.error("Failed to reset admin password:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();