import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const TABLES = [
  "users",
  "admins",
  "login_tokens",
  "email_verification_tokens",
  "styles",
  "jobs",
  "job_media"
];

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    await pg.query(`CREATE SCHEMA IF NOT EXISTS pet_portraits`);

    for (const t of TABLES) {
      const src = `public.${t}`;
      const dst = `pet_portraits.${t}`;
      const srcExists = (await pg.query(`SELECT to_regclass($1) AS r`, [src])).rows[0]?.r;
      const dstExists = (await pg.query(`SELECT to_regclass($1) AS r`, [dst])).rows[0]?.r;
      if (srcExists && !dstExists) {
        console.log(`Moving ${src} -> pet_portraits.${t}`);
        await pg.query(`ALTER TABLE ${src} SET SCHEMA pet_portraits`);
      } else {
        console.log(`Skip ${t}: srcExists=${!!srcExists}, dstExists=${!!dstExists}`);
      }
    }

    console.log("Migration complete: moved existing public tables to pet_portraits schema where applicable");
  } catch (e) {
    console.error("Schema move migration failed:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();