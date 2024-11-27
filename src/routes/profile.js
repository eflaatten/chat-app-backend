const express = require("express");
const { changeProfilePicture } = require("../controllers/profile");
const { authenticateToken } = require("../middleware/authenticate");
const router = express.Router();

router.post("/changeProfilePicture", authenticateToken, changeProfilePicture);

module.exports = router;
