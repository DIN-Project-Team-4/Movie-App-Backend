// routes/groupRoutes.js
const express = require('express');
const groupController = require('../controllers/groupController');

const router = express.Router();


router.post('/create', groupController.createGroup);
router.post('/:groupId/addmember/:userId', groupController.addMember);
router.delete('/:groupId/removemember/:userId', groupController.removeMember);
router.get('/all', groupController.getAllGroups);
router.get('/users/:userId/yourgroups', groupController.getGroupsByUser);
router.get('/:groupId/members', groupController.getMembersByGroup);
router.delete('/delete/:groupId', groupController.deleteGroup);

module.exports = router;
