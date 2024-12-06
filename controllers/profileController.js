const { getProfileByUser } = require("../models/profileModel.js");

const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        const favourites = await getProfileByUser(userId);
        res.status(200).json(favourites);
    } catch (error) {
        console.error("Error fetching favourites:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getProfile,
};
