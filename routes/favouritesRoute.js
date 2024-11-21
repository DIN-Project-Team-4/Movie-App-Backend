const express = require('express');
const {insertToFavourites} = require("../controllers/favouritesController.js")

const router = express.Router()

router.post('/movie', insertToFavourites)

module.exports = router
