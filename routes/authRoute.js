

const express = require('express');
const router = express.Router();
const {onAuthorization} =require('../controllers/authController');

router.post(`${process.env.BASE_URI}/auth`, onAuthorization); 

module.exports = router;