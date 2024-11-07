const { pool, Pool } = require('pg')

const dbConnection = (() => {
    try{
        const pool =new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password:process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: process.env.SSL
        })    
        return pool;
    } catch (error) {
        throw new Error(error.message);
    }
})

module.exports ={dbConnection}