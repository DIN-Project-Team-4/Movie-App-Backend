const express = require('express');
const {insertToFavourites, getFavourites} = require("../controllers/favouritesController.js");
const { AuthMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router()

router.post('/movie', AuthMiddleware, insertToFavourites)
router.get('/profile', AuthMiddleware, getFavourites)

module.exports = router
