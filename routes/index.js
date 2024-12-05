const express = require('express');
const healthCheck = require('./healthCheckRoute');
const auth = require('./authRoute');
const user = require('./userRoute');
const reviewRoute = require('./reviewRoute.js')
const favouritesRoute = require("./favouritesRoute");
const tmdbRoute = require('./tmdbRoute.js')
const groupRoute = require('./groupRoute.js');

console.log("Favourites route registered at /favourites"); //DEBUGGING

const router = express.Router();

router.use(healthCheck);
router.use(auth);
router.use(user);
router.use('/', reviewRoute)
router.use("/favourites", favouritesRoute);
router.use('/api/tmdb', tmdbRoute);
router.use('/groups', groupRoute);

module.exports = router;
