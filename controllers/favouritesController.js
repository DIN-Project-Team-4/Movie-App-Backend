const { toggleFavourite } = require("../models/favouritesModel.js");

// Function to toggle a movie as favourite
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
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    toggleFavouriteMovie,
};
