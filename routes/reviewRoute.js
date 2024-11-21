const express = require('express');
const {createReview, readReviews} = require("../controllers/reviewController.js")

const router = express.Router()

router.post('/movie/createReview', createReview)
router.get('/review',readReviews)

module.exports = router
