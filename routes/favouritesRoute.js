const express = require("express");
const { getFavourites, toggleFavouriteMovie, getFavouritesForUserId } = require("../controllers/favouritesController");
const { TokenInterceptor } = require("../middleware/tokenInterceptor");

const router = express.Router();

router.get("/", TokenInterceptor, getFavourites); 
router.post("/toggle", TokenInterceptor, toggleFavouriteMovie);
router.get("/share/:userId", getFavouritesForUserId);

module.exports = router;
