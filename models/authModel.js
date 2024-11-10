const { getAccessToken } = require('../helper/jwtHelper.js');
const { matchPassword } = require('../helper/hashStringHelper.js');
const { queryDb } = require('../repository/queryDatabase');



const validateUser = ((userEmail, loginPassword) => {
    return new Promise(async(resolve,reject) => {
        if (!userEmail || !loginPassword) {
            reject({statusCode: 400, message: 'Email or password cannot be empty.'});
            return;
        }

        // *check the user email and password in database and generate access token (JWT)
        // *check in database
        try{
            const dbResult = await queryDb('select user_id, password, email, username from "User" where email=$1', [userEmail]) 
            if (!dbResult.rows.length){ //if rows > 0
                reject({statusCode: 403, message: 'Invalid credentials, access denied.'});
                return;
            }

            //validate hashed password
            if (! await matchPassword(loginPassword, dbResult.rows[0].password)){
                reject({statusCode: 403, message: 'Invalid credentials, access denied.'});
                return;
            }
            //get id_user and user password
            const id_user = dbResult.rows[0].id_user;
            const email = dbResult.rows[0].email ;
            const password= dbResult.rows[0].password;
            const username =dbResult.rows[0].username;

            // ?if fund in database and the password matches generate the JWT token
            // * payload to generate access token
            jwtPayload = {
                userId: id_user,
                userEmail: userEmail,
                username:username
                
            }

            // *generate access token
            const accessToken = getAccessToken(jwtPayload) 

            // *retiring json  with access token
            returnJson = {
                userId: id_user,
                userEmail: userEmail,  
                username:username,                             
                accessToken: accessToken
            }

            resolve(returnJson);
            return;
        } catch (error) {
            reject({statusCode: 500, message: error.message});
            return;
        }
    })
})


module.exports = { validateUser };
