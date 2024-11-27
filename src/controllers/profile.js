const { uploadFileToS3 } = require('../aws/s3');
const db = require('../config/db');

const changeProfilePicture = async (req, res) => {
  try {
    const { user_id } = req.user;
    const fileStream = req;
    const fileType = req.headers["content-type"];

    if (!fileType) {
      return res
        .status(400)
        .json({ success: false, message: "Content-Type header is missing." });
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    const extension = fileType.split("/")[1];
    const key = `profile_pictures/${user_id}-${Date.now()}.${extension}`;

    console.log(
      "Uploading to S3 with Key:",
      key,
      "and Content-Type:",
      fileType
    );

    const result = await uploadFileToS3(bucketName, key, fileStream, fileType);

    if (result.success) {
      try {
        const query = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
        const values = [result.location, user_id];
        await db.query(query, values);

        return res.status(200).json({
          success: true,
          message: "Profile picture updated successfully.",
          location: result.location,
        });
      } catch (dbError) {
        console.error(
          "Error saving profile picture URL to DB:",
          dbError.message,
          dbError.stack
        );
        return res.status(500).json({
          success: false,
          message: "Failed to save profile picture URL to the database.",
        });
      }
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
      message: "An error occurred while updating the profile picture.",
    });
  }
};



module.exports = { changeProfilePicture };
