import { Client } from "pg";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

function isValidSig(id, sig) {
  const secret = process.env.SHARE_SECRET || "";
  if (!secret) return false;
  try {
    const expected = crypto.createHmac("sha256", secret).update(String(id)).digest("hex");
    return typeof sig === "string" && sig === expected;
  } catch (_) {
    return false;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const jobId = req.params?.id;
    if (!jobId) return res.status(400).json({ error: "job_id_required" });

    const sig = req.query?.sig;
    const hasSecret = !!process.env.SHARE_SECRET;

    // If a share secret is configured, require a valid signature. Otherwise, require auth.
    if (hasSecret) {
      if (!isValidSig(jobId, sig)) return res.status(403).json({ error: "invalid_signature" });
    } else {
      const userId = getUserIdFromCookie(req);
      if (!userId) return res.status(401).json({ error: "not_logged_in" });
    }

    const pg = new Client({ connectionString: process.env.DATABASE_URL });
    await pg.connect();

    const r = await pg.query(
      `SELECT composite_s3_key, result_s3_key FROM pet_portraits.jobs WHERE id = $1 LIMIT 1`,
      [jobId]
    );
    await pg.end();

    if (!r.rowCount) return res.status(404).json({ error: "job_not_found" });

    const s3Key = r.rows[0].composite_s3_key || r.rows[0].result_s3_key;
    if (!s3Key) return res.status(404).json({ error: "result_not_ready" });

    // Presign a short-lived URL (e.g., 15 minutes)
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const cmd = new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: s3Key });
      const url = await getSignedUrl(s3, cmd, { expiresIn: 900 });
      // Redirect to the presigned URL
      return res.redirect(302, url);
    } catch (err) {
      const meta = err?.$metadata || {};
      console.error("S3 presign failed:", err?.name, err?.message, meta.httpStatusCode);
      return res.status(500).json({ error: "s3_presign_failed" });
    }
  } catch (e) {
    console.error("job_view_redirect_error", e);
    return res.status(500).json({ error: "server_error" });
  }
}