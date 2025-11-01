import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const result = await pg.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'pet_portraits' AND table_name = 'jobs'
      ORDER BY ordinal_position;
    `);
    
    console.log("pet_portraits.jobs table structure:");
    console.log("=====================================");
    for (const row of result.rows) {
      console.log(`${row.column_name}: ${row.data_type}${row.is_nullable === 'NO' ? ' NOT NULL' : ''}${row.column_default ? ` DEFAULT ${row.column_default}` : ''}`);
    }
  } catch (e) {
    console.error("Failed to describe table:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();