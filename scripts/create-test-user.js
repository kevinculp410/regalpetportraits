import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const email = process.argv[2] || "test.user@example.com";
const name = process.argv[3] || "Test User";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);
    const r = await pg.query(`SELECT id FROM pet_portraits.users WHERE email = $1 LIMIT 1`, [email]);
    if (r.rowCount) {
      const id = r.rows[0].id;
      await pg.query(`UPDATE pet_portraits.users SET name = $1, email_verified = TRUE, updated_at = NOW() WHERE id = $2`, [name, id]);
      console.log("Updated existing user:", email, id);
    } else {
      const ins = await pg.query(
        `INSERT INTO pet_portraits.users (id, email, name, email_verified, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, TRUE, NOW(), NOW()) RETURNING id`,
        [email, name]
      );
      console.log("Created user:", email, ins.rows[0].id);
    }
  } catch (e) {
    console.error("create_test_user_error", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();