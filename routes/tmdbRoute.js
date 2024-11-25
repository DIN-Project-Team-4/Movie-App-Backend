const express = require('express');
const { getTrendingMovies, getGenres, searchByTitle, searchByYear, searchByGenre, getTrendingCelebrities, getLanguages, getCastIds, searchAdvanced } = require('../controllers/tmdbController.js');

const router = express.Router();

router.get('/trendingmovies', getTrendingMovies);
router.get('/genres', getGenres);
router.get('/search/bytitle', searchByTitle);
router.get('/search/byyear', searchByYear);
router.get('/search/bygenre', searchByGenre);
router.get('/trendingcelebrities', getTrendingCelebrities);
router.get('/language', getLanguages);
router.get('/cast', getCastIds);
router.get('/search/advance', searchAdvanced);

module.exports = router
