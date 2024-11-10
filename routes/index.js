const express = require('express');
const healthCheck = require('./healthCheckRoute');
const auth = require('./authRoute');
const user = require('./userRoute');

const router = express.Router();

router.use(healthCheck);
router.use(auth);
router.use(user);


module.exports = router;