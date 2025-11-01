import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

    const { job_id, filename, contentType } = req.body || {};
    if (!job_id || !filename || !contentType) {
      return res.status(400).json({ error: "job_id, filename, contentType required" });
    }

    const key = `uploads/${userId}/${job_id}/${filename}`;
    const s3 = new S3Client({ region: process.env.AWS_REGION });

    const putCmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType
    });
    const url = await getSignedUrl(s3, putCmd, { expiresIn: 300 });

    return res.json({ url, s3_key: key });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server_error" });
  }
}