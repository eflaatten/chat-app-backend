const express = require("express");
const { changeProfilePicture, removeProfilePicture } = require("../controllers/profile");
const { authenticateToken } = require("../middleware/authenticate");
const router = express.Router();

router.post("/changeProfilePicture", authenticateToken, upload, changeProfilePicture);

module.exports = router;
