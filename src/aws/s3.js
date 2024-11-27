// s3.js
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a file stream to S3
 * @param {string} bucket - The S3 bucket name.
 * @param {string} key - The key (path) for the file in the bucket.
 * @param {stream.Readable} fileStream - The file stream to upload.
 * @returns {Promise<object>} - Upload result containing location and metadata.
 */
export const uploadFileToS3 = async (bucket, key, fileStream) => {
  try {
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
      location: result.Location,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return {
      success: false,
      message: "File upload failed",
      error: error.message,
    };
  }
};
