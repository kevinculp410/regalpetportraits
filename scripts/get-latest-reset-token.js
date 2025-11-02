import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const email = process.argv[2] || null;

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    let r;
    if (email) {
      r = await pg.query(
        `SELECT prt.token
         FROM pet_portraits.password_reset_tokens prt
         JOIN pet_portraits.users u ON u.id = prt.user_id
         WHERE u.email = $1 AND prt.used = FALSE
         ORDER BY prt.expires_at DESC
         LIMIT 1`,
        [email]
      );
    } else {
      r = await pg.query(
        `SELECT token FROM pet_portraits.password_reset_tokens WHERE used = FALSE ORDER BY expires_at DESC LIMIT 1`
      );
    }
    if (!r.rowCount) {
      console.error("NO_RESET_TOKEN_FOUND");
      process.exitCode = 1;
    } else {
      console.log(r.rows[0].token);
    }
  } catch (e) {
    console.error("QUERY_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();