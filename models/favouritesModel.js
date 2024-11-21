const {queryDb} = require("../repository/queryDatabase.js")

// Function to add a given movie to a given user's favourites list
const addToFavourites = async (movieId, addedAt, userId, movieName) => {
    const sql = 'insert into "Favorit"(movie_id,added_at,user_user_id,movie_name) values ($1,$2,$3,$4) returning *'
    let result
    try {
        result = await queryDb(sql, [movieId, addedAt, userId, movieName])
        if (!result.rows.length) {
            throw new Error('Failed to insert to favourites')
        }
    } catch (error) {
        throw new Error(`Error adding to favourites: ${error.message}`);
    }
    return result.rows[0]
}

// Function to check if a given user has already added a given movie to favourites
const alreadyInFavourites = async (movieId, userId) => {
    const sql = 'select * from "Favorit" where movie_id = ($1) and user_user_id = ($2)'

    let result
    try {
        result = await queryDb(sql, [movieId, userId])
    } catch (error) {
        throw new Error(`Error checking if already added to favourites: ${error.message}`);
    }

    return result.rows.length > 0
}

module.exports = {addToFavourites, alreadyInFavourites}
