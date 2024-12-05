const express = require("express");
const { toggleFavouriteMovie } = require("../controllers/favouritesController");
const { TokenInterceptor } = require("../middleware/tokenInterceptor");

const router = express.Router();

router.post("/toggle", TokenInterceptor, toggleFavouriteMovie); 

module.exports = router;
