import { Client } from "pg";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const env = {
      aws_region: !!process.env.AWS_REGION,
      s3_bucket: !!process.env.S3_BUCKET,
      access_key_id: !!process.env.AWS_ACCESS_KEY_ID,
      secret_access_key: !!process.env.AWS_SECRET_ACCESS_KEY,
      session_token: !!process.env.AWS_SESSION_TOKEN,
      database_url: !!process.env.DATABASE_URL,
    };

    const details = {
      aws_region: process.env.AWS_REGION || null,
      s3_bucket: process.env.S3_BUCKET || null,
    };

    let s3Ok = false;
    let s3Error = null;
    try {
      const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          sessionToken: process.env.AWS_SESSION_TOKEN,
        },
      });
      const r = await s3.send(new HeadBucketCommand({ Bucket: process.env.S3_BUCKET }));
      s3Ok = !!r;
    } catch (e) {
      s3Error = { name: e?.name, message: e?.message };
    }

    // Try DB and pull one style preview_url
    let sampleStyle = null;
    try {
      const pg = new Client({ connectionString: process.env.DATABASE_URL });
      await pg.connect();
      const r = await pg.query(`SELECT id, preview_url, s3_key FROM pet_portraits.styles WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1`);
      await pg.end();
      if (r.rowCount) sampleStyle = r.rows[0];
    } catch (_) {}

    return res.json({ env, details, s3Ok, s3Error, sampleStyle });
  } catch (e) {
    console.error("diagnostics_s3_error", e);
    return res.status(500).json({ error: "server_error" });
  }
}