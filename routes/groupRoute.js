// routes/groupRoutes.js
const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();


router.post('/create', groupController.createGroup);
router.post('/addmember', groupController.addMember);
router.delete('/removemember', groupController.removeMember);
router.get('/all', groupController.getAllGroups);
router.get('/:groupId/members', groupController.getMembersByGroup);

module.exports = router;
