

const express = require('express');
const { AuthMiddleware } = require('../middleware/authMiddleware')
const router = express.Router();
const {onRegister, onFindOneUser, onFindUsers,onFindOneUserbyEmail,onDeleteUser} = require('../controllers/userController');

router.post(`${process.env.BASE_URI}/users`, onRegister); 
router.get(`${process.env.BASE_URI}/users/:userId`, AuthMiddleware, onFindOneUser); 
router.get(`${process.env.BASE_URI}/users`, AuthMiddleware, onFindUsers); 
router.get(`${process.env.BASE_URI}/delete/:userId`, AuthMiddleware, onDeleteUser);
//router.post(`${process.env.BASE_URI}/find-user-by-email`, AuthMiddleware, onFindOneUserbyEmail); 
//router.get(`${process.env.BASE_URI}/users`, AuthMiddleware, onFindOneUserbyEmail); 

module.exports = router;