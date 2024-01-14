import { S3Client } from "@aws-sdk/client-s3";

// create s3 instance using S3Client
// (this is how we create s3 instance in v3)
const s3 = new S3Client({
    endpoint: "https://s3.tebi.io",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY, // store it in .env file to keep it safe
      secretAccessKey: process.env.SECRET_KEY,
    },
    region: "global", // this is the region that you select in AWS account
  });

export {s3}