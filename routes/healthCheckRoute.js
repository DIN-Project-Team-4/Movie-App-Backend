

const express = require('express');
const router = express.Router();

router.get(`${process.env.BASE_URI}/health-check`, (req, res) => res.sendStatus(200));

module.exports = router;