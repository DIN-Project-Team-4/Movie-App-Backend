const express = require("express");
const { getFavourites, toggleFavouriteMovie } = require("../controllers/favouritesController");
const { TokenInterceptor } = require("../middleware/tokenInterceptor");

const router = express.Router();

router.get("/", TokenInterceptor, getFavourites); 
router.post("/toggle", TokenInterceptor, toggleFavouriteMovie);

module.exports = router;
