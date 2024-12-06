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
router.delete('/:groupId/leave/:userId', groupController.leaveGroup);

router.get('/:groupId/messages', groupController.getMessagesByGroup);
router.post('/:groupId/messages', groupController.addMessageToGroup);
router.patch('/:groupId/messages/update', groupController.updateMessage);
router.post('/:groupId/movies', groupController.addMovieSuggestions);
router.get('/:group/movies', groupController.getMovieMessagesByGroup)

router.post('/:groupId/apply', groupController.applyToJoinGroup);
router.put('/:groupId/review', groupController.reviewApplication);
router.get('/:groupId/name', groupController.getGroupsName);

module.exports = router;
