const { queryDb } = require("../repository/queryDatabase.js");

// ADDING SINGLE MOVIE TO FAVOURITES
const addToFavourites = async (movieId, addedAt, userId, movieName) => {
    const sql = 'INSERT INTO "Favorit"(movie_id, added_at, user_user_id, movie_name) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await queryDb(sql, [movieId, addedAt, userId, movieName]);
    if (!result.rows.length) {
        throw new Error("Failed to add to favourites");
    }
    return result.rows[0];
};

// REMOVING SINGLE MOVIE FROM FAVOURITES
const removeFromFavourites = async (movieId, userId) => {
    const sql = 'DELETE FROM "Favorit" WHERE movie_id = $1 AND user_user_id = $2 RETURNING *';
    const result = await queryDb(sql, [movieId, userId]);
    if (!result.rows.length) {
        throw new Error("Failed to remove from favourites");
    }
    return result.rows[0];
};

// CHECKING IF MOVIE IS ALREADY FAVOURITED
const toggleFavourite = async (movieId, userId, movieName) => {
    const checkSql = 'SELECT * FROM "Favorit" WHERE movie_id = $1 AND user_user_id = $2';
    const deleteSql = 'DELETE FROM "Favorit" WHERE movie_id = $1 AND user_user_id = $2';
    const insertSql = 'INSERT INTO "Favorit"(movie_id, added_at, user_user_id, movie_name) VALUES ($1, NOW(), $2, $3) RETURNING *';

    const result = await queryDb(checkSql, [movieId, userId]);
    if (result.rows.length > 0) {
        await queryDb(deleteSql, [movieId, userId]);
        return { message: "Movie removed from favourites", removed: true };
    } else {
        const insertResult = await queryDb(insertSql, [movieId, userId, movieName]);
        return { message: "Movie added to favourites", added: true, data: insertResult.rows[0] };
    }
};

// PREPARATION FOR FETCHING FAVOURITE LIST (NOT DONE)
const getFavouritesByUser = async (userId) => {
    try {
        //console.log("Fetching favourites for user ID:", userId); // DEBUGGING
        const sql = 'SELECT * FROM "Favorit" WHERE user_user_id = $1';
        const result = await queryDb(sql, [userId]);
        //console.log("Query executed successfully. Result rows:", result.rows); // DEBUGGING
        return result.rows;
    } catch (error) {
        console.error("Error in getFavouritesByUser:", error.message); // DEBUGGING
        throw error;
    }
};

module.exports = {
    addToFavourites,
    removeFromFavourites,
    toggleFavourite,
    getFavouritesByUser
};
