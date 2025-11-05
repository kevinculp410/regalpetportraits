import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

const jobId = process.argv[2] || null;
if (!jobId) {
  console.error("USAGE: node scripts/db-check-job-amount.js <job_id>");
  process.exit(1);
}

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const r = await pg.query(
      `SELECT id, amount_cents FROM pet_portraits.jobs WHERE id = $1`,
      [jobId]
    );
    if (!r.rowCount) {
      console.log(JSON.stringify({ ok: false, error: "not_found", jobId }));
    } else {
      console.log(JSON.stringify({ ok: true, job: r.rows[0] }));
    }
  } catch (e) {
    console.error("QUERY_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();