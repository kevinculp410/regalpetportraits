import { S3Client } from "@aws-sdk/client-s3";

export async function createS3Client(regionHint = null) {
  const bucket = process.env.S3_BUCKET;
  let region = regionHint || process.env.AWS_REGION || "us-east-1";

  try {
    if (bucket && !regionHint) {
      const resp = await fetch(`https://${bucket}.s3.amazonaws.com/`, { method: "HEAD" });
      const detected = resp.headers.get("x-amz-bucket-region");
      if (detected) region = detected;
    }
  } catch (_) {
    // ignore detection errors; fall back to env region
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    },
  });
}