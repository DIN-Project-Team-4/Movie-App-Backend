const express = require('express');
const {createReview, readReviews} = require("../controllers/reviewController.js");
const { AuthMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router()

router.post('/movie/createReview', AuthMiddleware, createReview)
router.get('/reviews/:movieId?/:showAllReviews?',readReviews)

module.exports = router
