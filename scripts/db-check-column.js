import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const [schema, table, column] = process.argv.slice(2);
if (!schema || !table || !column) {
  console.error("USAGE: node scripts/db-check-column.js <schema> <table> <column>");
  process.exit(1);
}

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const r = await pg.query(
      `SELECT 1 FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2 AND column_name = $3`,
      [schema, table, column]
    );
    console.log(JSON.stringify({ schema, table, column, exists: r.rowCount > 0 }));
  } catch (e) {
    console.error("CHECK_COLUMN_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();