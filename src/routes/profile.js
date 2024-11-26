const express = require("express");
const { changeProfilePicture, removeProfilePicture } = require("../controllers/profile");
const { authenticateToken } = require("../middleware/authenticate");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("profile_picture");
const router = express.Router();

router.post("/changeProfilePicture", authenticateToken, upload, changeProfilePicture);
router.delete("/removeProfilePicture", authenticateToken, removeProfilePicture);

module.exports = router;
