import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const exists = await pg.query(`
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'pet_portraits' AND table_name = 'jobs_archive'
      LIMIT 1
    `);
    if (!exists.rowCount) {
      console.log(JSON.stringify({ ok: false, error: "jobs_archive_missing" }));
      return;
    }
    const cols = await pg.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'pet_portraits' AND table_name = 'jobs_archive'
      ORDER BY ordinal_position
    `);
    console.log(JSON.stringify({ ok: true, columns: cols.rows }));
  } catch (e) {
    console.error("DESCRIBE_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();