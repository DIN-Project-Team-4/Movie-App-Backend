const express = require('express');
const {insertToFavourites, getFavourites, deleteFromFavourites} = require("../controllers/favouritesController.js");
const { AuthMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router()

router.post('/movie', AuthMiddleware, insertToFavourites)
router.get('/profile', AuthMiddleware, getFavourites)
router.delete('/movie', AuthMiddleware, deleteFromFavourites)

module.exports = router
