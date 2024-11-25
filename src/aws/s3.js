const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_REGION } =
  process.env;

// Create an S3 client
const s3 = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const uploadProfilePictureToS3 = async (user_id, imageBuffer) => {
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `profile_pictures/${user_id}/${Date.now()}.jpg`, // Organized by user_id
      Body: imageBuffer,
      ContentType: "image/jpeg", // Validate file type
    };

    // Use PutObjectCommand to upload to S3
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Construct the S3 object URL
    const imageUrl = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${params.Key}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    throw error;
  }
};

module.exports = { uploadProfilePictureToS3 };
