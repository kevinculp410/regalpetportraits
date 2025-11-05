import { Client } from "pg";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "../../lib/s3.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    const id = req.params?.id;
    if (!id) return res.status(400).json({ error: "style_id_required" });

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const r = await pg.query(`SELECT s3_key, preview_url FROM pet_portraits.styles WHERE id = $1 LIMIT 1`, [id]);
    await pg.end();

    if (!r.rowCount) return res.status(404).json({ error: "not_found" });
    const s3Key = r.rows[0].s3_key;
    const previewUrl = r.rows[0].preview_url || "";
    let regionHint = null;
    const m = previewUrl.match(/\.s3\.(.*?)\.amazonaws\.com\//);
    if (m && m[1]) regionHint = m[1];

    const s3 = await createS3Client(regionHint);

    try {
      const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: s3Key });
      const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 15 });
      return res.redirect(302, url);
    } catch (err) {
      const meta = err?.$metadata || {};
      console.error("S3 presign failed:", err?.name, err?.message, meta.httpStatusCode);
      return res.status(500).json({ error: "s3_get_failed" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}