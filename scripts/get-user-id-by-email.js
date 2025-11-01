import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const email = process.argv[2];
if (!email) {
  console.error("USAGE: node scripts/get-user-id-by-email.js <email>");
  process.exit(1);
}

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const r = await pg.query(`SELECT id, email_verified FROM pet_portraits.users WHERE email = $1 LIMIT 1`, [email]);
    if (!r.rowCount) {
      console.error("NO_USER");
      process.exitCode = 1;
    } else {
      const row = r.rows[0];
      console.log(JSON.stringify({ id: row.id, email_verified: !!row.email_verified }));
    }
  } catch (e) {
    console.error("QUERY_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();