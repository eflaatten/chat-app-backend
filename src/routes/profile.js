const express = require("express");
const { uploadProfilePicture } = require("../controllers/profile");
const { authenticateToken } = require("../middleware/authenticate");
// const multer = require("multer");
// const upload = multer();
const router = express.Router();

router.post("/uploadProfilePicture", authenticateToken, uploadProfilePicture);

module.exports = router;
