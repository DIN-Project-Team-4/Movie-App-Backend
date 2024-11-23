const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// API endpoint to get trending movies tmdb api
const getTrendingMovies = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/movie/day?language=en`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching trending movies:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
};

// API endpoint to get the list of genres from tmdb api
const getGenres = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list?language=en`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
};

// API endpoint to get movies by title from tmdb api
const searchByTitle = async (req,res) => {
    const { searchText, page } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            params: {
                query: searchText,
                include_adult: false,
                language: 'en-US',
                page: page || 1,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error searching for movies by title:', error.message);
        res.status(500).json({ error: 'Failed to search for movies' });
    }
}

// API endpoint to get movies by year from tmdb api
const searchByYear = async (req,res) => {
    const { searchText, page } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: page || 1,
                primary_release_year: searchText,
                sort_by: 'popularity.desc',
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error searching for movies by year:', error.message);
        res.status(500).json({ error: 'Failed to search for movies' });
    }
}

// API endpoint to get movies by genre from tmdb api
const searchByGenre = async (req,res) => {
    const { genreIdsConcat, page } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
            params: {
                include_adult: false,
                include_video: false,
                language: 'en-US',
                page: page || 1,
                sort_by: 'popularity.desc',
                with_genres: genreIdsConcat
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error searching for movies by genre:', error.message);
        res.status(500).json({ error: 'Failed to search for movies' });
    }
}

// API endpoint to get trending celebrities tmdb api
const getTrendingCelebrities = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/person/day?language=en-US`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching trending celebrities:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending celebrities' });
    }
};

module.exports = { getTrendingMovies, getGenres, searchByTitle, searchByYear, searchByGenre, getTrendingCelebrities }
