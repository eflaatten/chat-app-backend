const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = users[0];
    console.log("User:", user);
    // Ensure the field name matches the database schema
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.user_id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Account already exists" });
    }

    // Generate a UUID for the user
    const user_id = uuidv4();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const query =
      "INSERT INTO users (user_id, username, email, password) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [
      user_id,
      username,
      email,
      hashedPassword,
    ]);

    // Generate token for the user
    const token = jwt.sign(
      { user_id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send success response with the token
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error creating user" });
  }
};

//Logout Controller
exports.logout = (req, res) => {
  res.json({ message: "Logout successful" });
};