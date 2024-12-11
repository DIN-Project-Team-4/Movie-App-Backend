const axios = require("axios");

const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
const BASE_URL = process.env.TMDB_API_URL;

async function getMovieDetailsById(id) {
    const result = await axios.get(`${BASE_URL}/movie/${id}`, {
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${tmdbToken}`,
        },
        params: {
            append_to_response: 'videos,credits',
            language: 'en-US',
        },
    });
    return result.data
}

module.exports = {
    getMovieDetailsById
}