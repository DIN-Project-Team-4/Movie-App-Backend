const express = require("express");
const { getProfile } = require("../controllers/profileController");
const { TokenInterceptor } = require("../middleware/tokenInterceptor");

const router = express.Router();

router.get("/:userId", TokenInterceptor, getProfile);

module.exports = router;
