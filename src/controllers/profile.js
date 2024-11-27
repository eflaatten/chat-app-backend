const db = require("../config/db");
const { uploadFileToS3 } = require("../aws/s3");

const changeProfilePicture = async (req, res) => {
  try {
    const { user_id } = req.user;
    const fileStream = req;

    if (!req.headers["content-type"]) {
      return res.status(400).json({ success: false, message: "Content-Type header is missing." });
    }

    const bucketName = process.env.AWS_BUCKET_NAME;
    const key = `profile_pictures/${user_id}-${Date.now()}`;

    const result = await uploadFileToS3(bucketName, key, fileStream);

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
    console.error("Error changing profile picture:", error);
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
