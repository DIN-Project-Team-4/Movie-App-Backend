const { getAccessToken,getRefreshToken } = require('../helper/jwtHelper.js');
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

            //read user details
            const user_id = dbResult.rows[0].user_id;
            const password= dbResult.rows[0].password;
            const username =dbResult.rows[0].username;

            //validate hashed password
            if (!await matchPassword(loginPassword, password)){
                reject({statusCode: 403, message: 'Invalid credentials, access denied.'});
                return;
            }

            // ?if fund in database and the password matches generate the JWT token
            //update last sucessful login date & time
            const sql = 'Update "User" Set last_login=$1 Where user_id=$2';
            await queryDb(sql, [new Date(), user_id]);

            // * payload to generate access token
            jwtPayload = {
                userId: user_id,
                userEmail: userEmail,
                username:username   
            }

            // *generate access token
            const accessToken = getAccessToken(jwtPayload) 
            //*generate refreash token
            const refreshToken = getRefreshToken(jwtPayload);


            // *retiring json  with access token
            returnJson = {
                userId: user_id,
                userEmail: userEmail,  
                username:username,                             
                accessToken: accessToken,
                tokenCreatedOn: Date.now,
                expiresIn: process.env.JWT_TOKEN_EXP || "60m",
                refreshExpiresIn: process.env.REFRESH_TOKEN_EXP || "14d",
                refreshToken: refreshToken, // This is added to the response
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
