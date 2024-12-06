

const express = require('express');
const { TokenInterceptor } = require('../middleware/tokenInterceptor'); // Import the middleware

const router = express.Router();
const {onRegister, onFindOneUser, onFindUsers,onFindOneUserbyEmail,onDeleteUser, onGetCurrentUser} = require('../controllers/userController');

router.post(`${process.env.BASE_URI}/users`, onRegister); 
router.get(`${process.env.BASE_URI}/users/:userId`, TokenInterceptor, onFindOneUser); 
router.get(`${process.env.BASE_URI}/users`, TokenInterceptor, onFindUsers); 
router.get(`${process.env.BASE_URI}/delete/:userId`, TokenInterceptor, onDeleteUser);
//router.post(`${process.env.BASE_URI}/find-user-by-email`, AuthMiddleware, onFindOneUserbyEmail); 
//router.get(`${process.env.BASE_URI}/users`, AuthMiddleware, onFindOneUserbyEmail); 

//added part for Profile Page
router.get(`${process.env.BASE_URI}/users/me`, TokenInterceptor, onGetCurrentUser);

module.exports = router;