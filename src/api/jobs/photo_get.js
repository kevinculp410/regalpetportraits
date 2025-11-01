import { Client } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });

    const jobId = req.params?.id;
    if (!jobId) return res.status(400).json({ error: "job_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const r = await pg.query(`SELECT upload_s3_key FROM pet_portraits.jobs WHERE id = $1 AND user_id = $2 LIMIT 1`, [jobId, userId]);
    await pg.end();

    if (!r.rowCount) return res.status(404).json({ error: "not_found" });
    const s3Key = r.rows[0].upload_s3_key;
    if (!s3Key) return res.status(404).json({ error: "photo_not_set" });

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const obj = await s3.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: s3Key }));
      const ct = obj.ContentType || "image/jpeg";
      res.setHeader("Content-Type", ct);
      if (obj.CacheControl) res.setHeader("Cache-Control", obj.CacheControl);
      obj.Body.pipe(res);
    } catch (err) {
      const meta = err?.$metadata || {};
      console.error("S3 get failed:", err?.name, err?.message, meta.httpStatusCode);
      return res.status(500).json({ error: "s3_get_failed" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}