import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function getUserIdFromCookie(req) {
  const cookie = req.headers.cookie || "";
  const map = Object.fromEntries(cookie.split(";").map(x => x.trim().split("=")));
  return map.uid || null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const userId = getUserIdFromCookie(req);
    if (!userId) return res.status(401).json({ error: "not_logged_in" });

    // Expect headers: x-job-id, x-filename; and raw binary body
    const jobId = req.headers["x-job-id"]; // should be uuid
    const filename = req.headers["x-filename"]; // original filename
    const contentType = req.headers["content-type"] || "application/octet-stream";

    if (!jobId || !filename) {
      return res.status(400).json({ error: "x-job-id and x-filename headers required" });
    }
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ error: "raw binary body required" });
    }

    const key = `uploads/${userId}/${jobId}/${filename}`;

    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: req.body,
        ContentType: contentType,
        CacheControl: "private, max-age=31536000"
      }));
      return res.json({ ok: true, s3_key: key });
    } catch (err) {
      const meta = err?.$metadata || {};
      console.error("Direct S3 upload failed:", err?.name, err?.message, meta.httpStatusCode);
      return res.status(500).json({ error: "s3_upload_failed" });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}