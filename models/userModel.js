const { queryDb } = require('../repository/queryDatabase');
const { RandomString } = require('../helper/commonHelper.js');
const { hashPassword } = require('../helper/hashStringHelper.js');

const createUser = ((user) => {
    return new Promise(async(resolve,reject) => {
        if (!user.userEmail || !user.password || !user.username ){
            reject({statusCode: 400, message: 'Missing one of more required field(s).'});
            return;
        }

        try{
            const dbResult = await queryDb('select user_id from "User" where email=$1', [user.userEmail]) 

            //check email is already registered
            if (dbResult.rows.length){
                reject({statusCode: 302, message: 'Email address already registered with cineScope.'});
                return;
            }

            // generate activation string
            //const activationString =  RandomString(25);
            const hashedPassword = await hashPassword(user.password);
            
            //save member profile
            //construct sql string
            let sql = 'insert into "User" (email, password, username, created_at) ' 
            sql += 'values ($1, $2, $3, $4) returning '
            sql += 'user_id, email, username, created_at ' 

            //save member and create the profile
            const dbResultSave = await queryDb(sql, 
                [user.userEmail, hashedPassword, user.username, new Date]);

            const returnJson = {
                userId: dbResultSave.rows[0].user_id,
                userEmail: dbResultSave.rows[0].email,
                username: dbResultSave.rows[0].username,
                createDate: dbResultSave.rows[0].created_at
            }
            
            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const findOneUser = ((userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            const sql = `select user_id, email, username, created_at from "User" where user_id=$1`
    
            //update member and activate the profile
            const dbResult = await queryDb(sql, [userId]);
    
            //check fetched records
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid user id, user not found.'});
                return;
            }
    
            const returnJson = {
                userId: dbResult.rows[0].user_id,
                userEmail: dbResult.rows[0].email,
                username: dbResult.rows[0].username,
                createDate: dbResult.rows[0].created_at               
            }
    
            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})

const findUsers = ((userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            const sql = `select user_id, email, username, created_at from "User" order by user_id`
    
            //update member and activate the profile
            const dbResult = await queryDb(sql);
    
            //check fetched records
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'No users available in the database.'});
                return;
            }


            let returnJson = []
            dbResult.rows.map(async (row)=> {
                returnJson.push({
                    userId: row.user_id,
                    userEmail: row.email,
                    username: row.username,
                    createDate: row.created_at
                })
            });
        
            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})



module.exports = { createUser, findOneUser, findUsers };