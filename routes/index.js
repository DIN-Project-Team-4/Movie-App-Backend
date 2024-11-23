const express = require('express');
const healthCheck = require('./healthCheckRoute');
const auth = require('./authRoute');
const user = require('./userRoute');
const reviewRoute = require('./reviewRoute.js')
const favouritesRoute = require('./favouritesRoute.js')
const tmdbRoute = require('./tmdbRoute.js')

const router = express.Router();

router.use(healthCheck);
router.use(auth);
router.use(user);
router.use('/', reviewRoute)
router.use('/', favouritesRoute)
router.use('/api/tmdb', tmdbRoute);

module.exports = router;
