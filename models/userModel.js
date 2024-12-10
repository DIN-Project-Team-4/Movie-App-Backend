const { queryDb } = require('../repository/queryDatabase');
const { RandomString } = require('../helper/commonHelper.js');
const { hashPassword } = require('../helper/hashStringHelper.js');
const {query} = require("express");
const { deleteGroupById } = require('./groupModel')

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
                reject({statusCode: 409, message: 'Email address already registered with cineScope.'});
                return;
            }

            // generate activation string
            //const activationString =  RandomString(25);
            const hashedPassword = await hashPassword(user.password);
            
            //save member profile
            //construct sql string
            let sql = 'insert into "User" (email, password, username, created_at) ' 
            sql += 'values ($1, $2, $3, $4) returning '
            sql += 'user_id, email, username, created_at' 

            //save member and create the profile
            const dbResultSave = await queryDb(sql, 
                [user.userEmail, hashedPassword, user.username, new Date()]);

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
            const sql = `select user_id, email, username, last_login, created_at from "User" where user_id=$1`
    
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
                lastLoginDate: dbResult.rows[0].last_login,
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

const findOneUserbyEmail = ((email) => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            const sql = `select user_id, email, username, last_login, created_at from "User" where email=$1`
    
            //update member and activate the profile
            const dbResult = await queryDb(sql, [email]);
    
            //check fetched records
            if (!dbResult.rows.length){
                reject({statusCode:404, message: 'Invalid user email, user not found.'});
                return;
            }
   
    
            const returnJson = {
                userId: dbResult.rows[0].user_id,
                userEmail: dbResult.rows[0].email,
                username: dbResult.rows[0].username,
                sharedUrl: dbResult.rows[0].shared_url,               
                lastLoginDate: dbResult.rows[0].last_login,
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

const findUsers = (() => {
    return new Promise(async(resolve,reject) => {
        try{
            //Searching for user
            //construct sql string
            const sql = `select user_id, email, username, last_login, created_at from "User" order by user_id`
    
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
                    lastLoginDate: row.last_login,
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

const lastLogin = ((userId) => {
    return new Promise(async(resolve,reject) => {
        try{
            //update users lastlogin time
            //construct sql string
            const sql = `update "User" set last_login =$1 where user_id =$2 returning *`
    
            //update users last login
            const dbResult = await queryDb(sql,[user_id, new Date()]);
    
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
                    createDate: row.created_at,
                    last_login: row.last_login
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

// New function to delete a user
const deleteUser = ((userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            await deleteGroupsThatBelongToUser(userId)

            await queryDb('DELETE FROM "Review" WHERE user_id=$1', [userId])
            await queryDb('DELETE FROM "Favorit" WHERE user_user_id=$1', [userId])
            await queryDb('DELETE FROM "User_has_Group" WHERE user_user_id=$1', [userId])
            await queryDb('DELETE FROM "messages" WHERE sender_id=$1', [userId])
            await queryDb('DELETE FROM "messagevotes" WHERE user_id=$1', [userId])

            // SQL query to delete the user by ID
            const dbResult = await queryDb(
                `delete from "User" where user_id=$1 returning *`,
                [userId]
            );

            if (!dbResult.rows.length) {
                reject({ statusCode: 404, message: 'User not found.' });
                return;
            }

            resolve(true);  // Return true if deletion is successful
        } catch (error) {
            console.log('userController delete error: ', error)
            reject({ statusCode: 500, message: error.message });
        }
    });
});

async function deleteGroupsThatBelongToUser(userId) {
    const dbResult = await queryDb(
        `SELECT * FROM "Group" WHERE owners_id=$1`,
        [userId]
    );
    const groups = dbResult.rows
    for (const group of groups) {
        await deleteGroupById(group.group_id)
    }
}

module.exports = { createUser, findOneUser, findUsers, lastLogin, findOneUserbyEmail, deleteUser };