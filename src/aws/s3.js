const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (bucket, key, fileStream) => {
  try {
    console.log("Uploading to S3 Bucket:", bucket, "Key:", key);

    if (!bucket) {
      throw new Error("Bucket name is undefined.");
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: fileStream,
      },
    });

    const result = await upload.done();
    return {
      success: true,
      message: "File uploaded successfully",
      location: `https://${bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error.message);
    return {
      success: false,
      message: "File upload failed",
      error: error.message,
    };
  }
};

module.exports = { uploadFileToS3 };
