// routes/groupRoutes.js
const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();


router.post('/create', groupController.createGroup);
router.post('/addmember', groupController.addMember);
router.delete('/removemember', groupController.removeMember);

module.exports = router;
