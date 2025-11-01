import dotenv from "dotenv";
dotenv.config();
import { Client } from "pg";

(async () => {
  const pg = new Client({ connectionString: process.env.DATABASE_URL });
  await pg.connect();
  try {
    const result = await pg.query(`
      SELECT id, user_id, style_id, status, upload_s3_key, result_s3_key, created_at, updated_at, completed_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT 50
    `);
    console.log("jobs_count:", result.rowCount);
    for (const r of result.rows) {
      console.log(JSON.stringify({
        id: r.id,
        user_id: r.user_id,
        style_id: r.style_id,
        status: r.status,
        upload_s3_key: r.upload_s3_key,
        result_s3_key: r.result_s3_key,
        created_at: r.created_at,
        updated_at: r.updated_at,
        completed_at: r.completed_at
      }));
    }
  } catch (e) {
    console.error("db_dump_error:", e);
    process.exitCode = 1;
  } finally {
    await pg.end();
  }
})();