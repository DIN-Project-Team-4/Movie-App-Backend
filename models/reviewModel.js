const {queryDb} = require("../repository/queryDatabase.js")

// Function to add a new review to database
const addReview = async (movieId, description, rating, reviewedAt, movieTitle, moviePosterUrl, userId) => {
    const sql = 'insert into "Review"(movie_id, description, rating, reviewed_at, movie_title, movie_poster_url, user_id) values ($1, $2, $3, $4, $5, $6, $7) returning *'
    let result
    try {
        result = await queryDb(sql, [movieId, description, rating, reviewedAt, movieTitle, moviePosterUrl, userId])
        if (!result.rows.length) {
            throw new Error('Failed to insert review')
        }
    } catch (error) {
        throw new Error(`Error adding review: ${error.message}`);
    }
    return result.rows[0]
}

// Function to check if a given user has already reviewed a given movie
const alreadyReviewed = async (movieID, userId) => {
    const sql = 'select * from "Review" where movie_id = ($1) and user_id = ($2)'
        
    let result
    try {
        result = await queryDb(sql, [movieID, userId])
    } catch (error) {
        throw new Error(`Error checking if reviewed: ${error.message}`);
    }

    return result.rows.length > 0
}

// Function to get all reviews 
const getReviews = async (movieId, viewAllReviews) => {
    movieId?.trim() !== ""? viewAllReviews : viewAllReviews=true
    const sql = `select R.review_id, R.movie_id, R.description, R.rating, TO_CHAR(R.reviewed_at, 'DD.MM.YY  HH24:MI') AS reviewed_at,  R.movie_title, R.movie_poster_url, R.user_id, U.username from "Review" R inner join  
                "User" U on R.user_id = U.user_id ${movieId?.trim() !== ""? "where movie_id = ($1)": ""} Order By R.reviewed_at desc ${viewAllReviews==false? "fetch first 10 rows only": ""}`
    try {
        const result = await queryDb(sql, movieId?.trim() !== ""? [movieId]: "")
        return result.rows
    } catch (error) {
        throw new Error(`Error getting reviews: ${error.message}`);
    }
}


module.exports = {addReview, alreadyReviewed, getReviews}
