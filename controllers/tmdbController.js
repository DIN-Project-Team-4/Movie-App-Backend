const axios = require('axios');

const tmdbToken = process.env.TMDB_ACCESS_TOKEN;
const BASE_URL = process.env.TMDB_API_URL;

// API endpoint to get trending movies tmdb api
const getTrendingMovies = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/trending/movie/day?language=en`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
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
                Authorization: `Bearer ${tmdbToken}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching genres:', error.message);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
};

// API endpoint to get movies by title from tmdb api
const searchByTitle = async (req, res) => {
    const { searchText, page } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/search/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
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
const searchByYear = async (req, res) => {
    const { searchText, page } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
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
const searchByGenre = async (req, res) => {
    const { genreIdsConcat, page } = req.query;
    try {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
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
                Authorization: `Bearer ${tmdbToken}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching trending celebrities:', error.message);
        res.status(500).json({ error: 'Failed to fetch trending celebrities' });
    }
};

// API endpoint to get the list of languages from tmdb api
const getLanguages = async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/configuration/languages`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching languages:', error.message);
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
};

// API endpoint to get the list of movies by advance search from tmdb api
const searchAdvanced = async (req, res) => {
    const { title, genre, cast, year, language, page } = req.query;
    try {
        //const castIDs = await getCastIds(cast)
        //

        const response = await axios.get(`${BASE_URL}/discover/movie`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
            },
            params: {
                include_adult: false,
                include_video: false,
                language: language,
                page: page || 1,
                primary_release_year: year,
                sort_by: 'popularity.desc',
                with_genres: genre,
                with_cast: cast
            },
        });

        res.status(200).json(response.data)
    } catch (error) {
        console.error('Error fetching movies by advance search:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies by advance search' });
    }
}

// API endpoint to get the list of possible cast member IDs from tmdb api
const getCastIds = async (req, res) => {
    const { castName } = req.query;
    try {
        const data = await getCastIdsFromPage(castName, 1)
        const persons = data.results
        const totalPages = data.total_pages
        let ids = persons.map((person) => person.id)
        for (let page = 2; page < totalPages; page++) {
            const pageData = await getCastIdsFromPage(castName, page)
            const pagePersons = pageData.results
            const pageIDs = pagePersons.map((person) => person.id)
            ids.push(...pageIDs)
        }
        res.status(200).json({ castIds: ids })
    } catch (error) {
        console.error('Error fetching cast member IDs:', error.message);
        res.status(500).json({ error: 'Failed to fetch movies by advance search' });
    }
};

const getCastIdsFromPage = async (castName, page) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/person`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
            },
            params: {
                query: castName,
                include_adult: false,
                language: 'en-US',
                page: page || 1,
            },
        });
        return response.data
    } catch (error) {
        console.error('Error fetching cast member IDs:', error.message);
        return null
    }
};

/* GET MOVIE DETAILS BY ID */
const getMovieDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
            },
            params: {
                append_to_response: 'videos,credits',
                language: 'en-US',
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error fetching movie details from TMDB:', error.response.data);
        } else {
            console.error('Error fetching movie details from TMDB:', error.message);
        }
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
};

const getMovieTrailer = async (req, res) => {
    const { id } = req.params;

    //console.log('Fetching video resources for Movie ID:', id); // For debugging

    try {
        const response = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
            },
            params: {
                language: 'en-US',
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching movie trailer from TMDB:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch movie trailer' });
    }
};

module.exports = { getTrendingMovies, getGenres, searchByTitle, searchByYear, searchByGenre, getTrendingCelebrities, getLanguages, getCastIds, searchAdvanced, getMovieDetails, getMovieTrailer }
