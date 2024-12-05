const { toggleFavourite, getFavouritesByUser } = require("../models/favouritesModel.js");

// Controller to fetch all favourites for the logged-in user
const getFavourites = async (req, res) => {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Please log in to view favourites" });
    }

    const userId = req.user.userId;

    try {
        const favourites = await getFavouritesByUser(userId); 
        res.status(200).json(favourites);
    } catch (error) {
        console.error("Error fetching favourites:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller to toggle favourite status of a movie
const toggleFavouriteMovie = async (req, res) => {
    const { movieId, movieName } = req.body;

    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: "Please log in to favourite a movie" });
    }

    const userId = req.user.userId;

    try {
        const result = await toggleFavourite(movieId, userId, movieName); 
        res.status(200).json(result);
    } catch (error) {
        console.error("Error toggling favourite movie:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getFavourites,
    toggleFavouriteMovie,
};
