const express = require('express');
const createReview = require("../controllers/reviewController.js")

const router = express.Router()

router.post('/review', createReview)

module.exports = router
