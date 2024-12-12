

const express = require('express');
const router = express.Router();
const {onAuthorization} =require('../controllers/authController');

router.post(`/api/v1/sign-in`, onAuthorization); 

module.exports = router;