const db = require("../config/db");
const { uploadToBlobStorage } = require("../vercel/uploadToBlobStore");

exports.changeProfilePicture = async (req, res) => {
  const { user_id } = req.user;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const blobUrl = await uploadToBlobStorage(
      file.buffer,
      `profile-${user_id}.jpg`
    );
    const [result] = await db.query(
      "UPDATE users SET profile_picture = ? WHERE user_id = ?",
      [blobUrl, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile picture updated successfully", url: blobUrl });
  } catch (error) {
    console.error("Change profile picture error:", error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

exports.removeProfilePicture = async (req, res) => {
  const { user_id } = req.user;

  try {
    const [users] = await db.query(
      "SELECT profile_picture FROM users WHERE user_id = ?",
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (!user.profile_picture) {
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    const fileName = user.profile_picture.split("/").pop();

    try {
      await axios.delete(user.profile_picture);
    } catch (deleteError) {
      console.error("Error deleting file from blob storage:", deleteError);
      return res
        .status(500)
        .json({ message: "Error deleting profile picture from storage" });
    }

    await db.query("UPDATE users SET profile_picture = NULL WHERE user_id = ?", [
      user_id,
    ]);

    res.json({ message: "Profile picture removed successfully", fileName });
  } catch (error) {
    console.error("Remove profile picture error:", error);
    res.status(500).json({ message: "Error removing profile picture" });
  }
};
