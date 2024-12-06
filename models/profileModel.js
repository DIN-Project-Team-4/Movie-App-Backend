const { queryDb } = require("../repository/queryDatabase.js");

const getProfileByUser = async (userId) => {
    try {
        console.log("Fetching profile for user ID:", userId); // DEBUGGING
        const sql = 'SELECT * FROM "User" WHERE user_id = $1';
        const result = await queryDb(sql, [userId]);
        console.log("Query executed successfully. Result rows:", result.rows); // DEBUGGING
        const foundUser = result.rows[0]
        if (!foundUser) {
            return null
        }
        return {
            email: foundUser.email,
            createdAt: foundUser.created_at,
            lastLogin: foundUser.last_login,
            sharedUrl: foundUser.shared_url,
            userId: foundUser.user_id,
            username: foundUser.username,
        }

    } catch (error) {
        console.error("Error in getProfileByUser:", error.message); // DEBUGGING
        throw error;
    }
};

module.exports = {
    getProfileByUser,
};