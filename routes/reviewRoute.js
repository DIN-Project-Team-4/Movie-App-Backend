const express = require('express');
const {createReview, readReviews} = require("../controllers/reviewController.js");
const { TokenInterceptor } = require('../middleware/tokenInterceptor.js');

const router = express.Router()

router.post('/movie/createReview', TokenInterceptor, createReview)
router.get('/reviews/:movieId?/:showAllReviews?',readReviews)

module.exports = router
