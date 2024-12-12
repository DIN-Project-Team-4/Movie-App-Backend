

const express = require('express');
const { TokenInterceptor } = require('../middleware/tokenInterceptor'); // Import the middleware

const router = express.Router();
const {onRegister, onFindOneUser, onFindUsers,onFindOneUserbyEmail,onDeleteUser} = require('../controllers/userController');


const { findOneUser } = require('../models/userModel'); // Import findOneUser


router.post(`/api/v1/users`, onRegister); 
router.get(`/api/v1/users/:userId`, TokenInterceptor, onFindOneUser); 
router.get(`/api/v1/users`, TokenInterceptor, onFindUsers); 
router.get(`/api/v1/delete/:userId`, TokenInterceptor, onDeleteUser);

//added part for Profile Page
router.get('/api/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        //console.log("Testing findOneUser with userId:", userId);

        const result = await findOneUser(userId);
        //console.log("Result from findOneUser:", result);

        if (!result) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in test-findOneUser:", error.message, error.stack);
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
});



module.exports = router;