const express = require("express");
const { changeProfilePicture } = require("../controllers/profile");
const { authenticateToken } = require("../middleware/authenticate");
const multer = require("multer");
const storage = multer.memoryStorage(); // Use memory storage for immediate upload
const upload = multer({ storage: storage }).single("profile_picture");
const router = express.Router();

router.post("/changeProfilePicture", authenticateToken, upload, changeProfilePicture);

module.exports = router;
