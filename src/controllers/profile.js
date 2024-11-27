const { uploadFileToS3 } = require('../aws/s3');

const changeProfilePicture = async (req, res) => {
  try {
    const { user_id } = req.user; 
    const contentType = req.headers["content-type"]; 

    if (!contentType) {
      return res
        .status(400)
        .json({ success: false, message: "Content-Type header is missing." });
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    console.log("Bucket Name from ENV:", bucketName);
    const key = `profile_pictures/${user_id}-${Date.now()}`;

    console.log(
      "Uploading to S3 with Key:",
      key,
      "and Content-Type:",
      contentType
    );

    const result = await uploadFileToS3(bucketName, key, req);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Profile picture updated successfully.",
        location: result.location,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("Error in changeProfilePicture:", error.message, error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to change profile picture.",
      error: error.message,
    });
  }
};

module.exports = {
  changeProfilePicture,
};
