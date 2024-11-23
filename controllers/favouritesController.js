const {addToFavourites, alreadyInFavourites, readFavourites, removeFromFavourites} = require("../models/favouritesModel.js")

// Function to add a new movie to favourites
const insertToFavourites = async (req, res) => {
    const {movieId, addedAt, userId, movieName} = req.body;

    if (!Number.isInteger(movieId)) {
        return res.status(400).json({error: 'Movie ID is invalid'})
    }

    if (userId === null) {
        return res.status(400).json({error: 'User ID cannot be null'})
    }

    // Check if the user has already added the movie to favourites
    try {
        const alreadyAddedMovie = await alreadyInFavourites(movieId, userId);
        if (alreadyAddedMovie) {
            return res.status(400).json({ error: 'User has already added this movie to favourites' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error while checking existing favourites: ' + error.message });
    }

    // Add movie to database
    try {
        const result = await addToFavourites(movieId, addedAt, userId, movieName)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(error.status || 500).json({error: error.message})
    }
}

// Function to get the full list of favourite movies of a user
const getFavourites = async (req, res) => {
    const {userId} = req.body;

    if (userId === null) {
        return res.status(400).json({error: 'User ID cannot be null'})
    }

    // Get favourites from database
    try {
        const result = await readFavourites(userId)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(error.status || 500).json({error: error.message})
    }
}

// Function to delete a given movie from favourites for a given user
const deleteFromFavourites = async (req, res) => {
    const {movieId, userId} = req.body;

    if (userId === null) {
        return res.status(400).json({error: 'User ID cannot be null'})
    }

    // Delete movie from favourites table in database for this user
    try {
        const result = await removeFromFavourites(movieId, userId)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(error.status || 500).json({error: error.message})
    }
}

module.exports = {insertToFavourites, getFavourites, deleteFromFavourites}
