import dotenv from "dotenv";
dotenv.config();

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

async function main() {
  const bucket = process.env.S3_BUCKET;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  const prefix = process.argv[2] || '';
  if (!prefix) {
    console.error("Usage: node scripts/s3-list-prefix.js <prefix>");
    process.exit(1);
  }

  const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });

  let ContinuationToken = undefined;
  let total = 0;
  console.log(`Listing s3://${bucket}/${prefix}`);
  while (true) {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken, MaxKeys: 1000 }));
    const contents = r.Contents || [];
    for (const o of contents) {
      console.log(o.Key);
      total += 1;
    }
    if (r.IsTruncated && r.NextContinuationToken) {
      ContinuationToken = r.NextContinuationToken;
    } else {
      break;
    }
  }
  console.log(`Total: ${total}`);
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});