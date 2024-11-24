const express = require("express");
const { fetchUserProfile } = require("../controllers/fetchData");
const { authenticateToken } = require("../middleware/authenticate");
const router = express.Router();

router.get("/profile", authenticateToken, fetchUserProfile);

module.exports = router;