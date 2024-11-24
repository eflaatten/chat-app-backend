const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.fetchUserProfile = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Decode the token to get the user_id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;

    // Fetch the user profile from the database
    const [users] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);
    res.json(users);
  } catch (error) {
    console.error("Fetch user profile error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
