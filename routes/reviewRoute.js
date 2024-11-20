const express = require('express');
const {createReview, readReviews} = require("../controllers/reviewController.js")

const router = express.Router()

router.post('/createReview', createReview)
router.get('/review',readReviews)

module.exports = router
