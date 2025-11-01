import dotenv from "dotenv";
dotenv.config();

import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

async function main() {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  const key = process.argv[2];
  if (!key) {
    console.error("Usage: node scripts/s3-head-object.js <s3-key>");
    process.exit(1);
  }

  if (!bucket || !region || !accessKeyId || !secretAccessKey) {
    console.error("Missing AWS env vars. Ensure S3_BUCKET, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY are set.");
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

  try {
    const r = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    console.log(JSON.stringify({ ok: true, bucket, key, contentType: r.ContentType, contentLength: r.ContentLength }, null, 2));
  } catch (err) {
    const code = err?.$metadata?.httpStatusCode || 0;
    console.error(JSON.stringify({ ok: false, bucket, key, error: err?.name || err?.message, status: code }, null, 2));
    process.exitCode = 1;
  }
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});