import { Client } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const id = req.params?.id;
    if (!id) return res.status(400).json({ error: "style_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const r = await pg.query(`SELECT s3_key FROM pet_portraits.styles WHERE id = $1 LIMIT 1`, [id]);
    await pg.end();

    if (!r.rowCount) return res.status(404).json({ error: "not_found" });
    const s3Key = r.rows[0].s3_key;

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const obj = await s3.send(new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: s3Key }));
      const ct = obj.ContentType || "image/png";
      res.setHeader("Content-Type", ct);
      if (obj.CacheControl) res.setHeader("Cache-Control", obj.CacheControl);
      // Stream the body
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