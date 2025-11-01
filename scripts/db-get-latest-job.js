import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const r = await pg.query(
      `SELECT id, user_id, style_id, status, created_at FROM jobs ORDER BY created_at DESC LIMIT 1`
    );
    if (!r.rowCount) {
      console.log(JSON.stringify({ ok: false, error: "no_jobs" }));
    } else {
      const j = r.rows[0];
      console.log(JSON.stringify({ ok: true, job: j }));
    }
  } catch (e) {
    console.error("QUERY_ERROR", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();