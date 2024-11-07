const { dbConnection } = require('./connectionDatabase');

const queryDb =((sql,values =[]) => {
    return new Promise(async(resolve,reject) => {
        try{
            const pool =dbConnection()                                                  
            const result = await pool.query(sql,values)
            resolve(result)
        }catch(error){
            reject(error);
        }
    })
})

module.exports = { queryDb }