import AWS from "aws-sdk"
import "dotenv/config"

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: "https://s3.timeweb.cloud",
  s3ForcePathStyle: true,
  region: process.env.AWS_REGION || "ru-1",
  apiVersion: "latest"
})

const s3 = new AWS.S3()

export default s3
