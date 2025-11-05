import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command, GetBucketLocationCommand, PutObjectCommand } from "@aws-sdk/client-s3";

async function main() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  if (!region || !bucket || !accessKeyId || !secretAccessKey) {
    console.error("Missing AWS env vars. Check AWS_REGION, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (and AWS_SESSION_TOKEN if using temporary credentials)");
    process.exit(1);
  }

  const s3 = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey, sessionToken },
  });

  console.log("Verifying S3 bucket access...", { region, bucket });

  try {
    const loc = await s3.send(new GetBucketLocationCommand({ Bucket: bucket }));
    console.log("Bucket location:", loc.LocationConstraint ?? "us-east-1 (legacy)");
  } catch (err) {
    console.error("GetBucketLocation error:", err.name, err.message);
    if (err.$metadata) console.error("RequestId:", err.$metadata.requestId);
  }

  try {
    const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 3, Prefix: "styles/" }));
    console.log("ListObjectsV2 success. keys:");
    (list.Contents || []).forEach(o => console.log("-", o.Key));
  } catch (err) {
    console.error("ListObjectsV2 error:", err.name, err.message);
    if (err.$metadata) console.error("RequestId:", err.$metadata.requestId);
  }

  try {
    const key = `styles/verify-${Date.now()}.txt`;
    const body = Buffer.from("s3 verify test\n");
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "text/plain" }));
    console.log("PutObject success:", key);
  } catch (err) {
    console.error("PutObject error:", err.name, err.message);
    if (err.$metadata) console.error("RequestId:", err.$metadata.requestId);
  }
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});