const db = require("../config/db");
const { uploadProfilePictureToS3 } = require("../aws/s3");

exports.uploadProfilePicture = async (req, res) => {
  const { user_id } = req.user;

  try {
    // Validate file existence
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }

    const imageBuffer = req.file.buffer; // Get the file buffer
    const uploadedImageUrl = await uploadProfilePictureToS3(
      user_id,
      imageBuffer
    );

    await db.query("UPDATE users SET profile_picture = ? WHERE user_id = ?", [
      uploadedImageUrl,
      user_id,
    ]);

    res.json({
      message: "Profile picture uploaded successfully",
      imageUrl: uploadedImageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
