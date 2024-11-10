const {validateUser } = require('../models/authModel')

const onAuthorization = (async (req, res) => {
    
    const requestBody = req.body;

    //check either email or password is there
    if (!requestBody.hasOwnProperty('userEmail') || !requestBody.hasOwnProperty('password')){
        return res.status(400).send({message: 'Invalid request, userEmail and password required.'});  
    }
    
    try{
        const userEmail = requestBody.userEmail;
        const password = requestBody.password;
        const result = await validateUser(userEmail, password);
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})     

module.exports = {onAuthorization};