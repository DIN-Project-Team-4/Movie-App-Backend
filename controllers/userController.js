const {createUser, findOneUser, findUsers, lastLogin,findOneUserbyEmail } = require('../models/userModel.js')

const onRegister = (async (req, res) => {
    const requestBody = req.body;
    //check for required poperies 
    if (!requestBody.hasOwnProperty('userEmail') || !requestBody.hasOwnProperty('password') ||
        !requestBody.hasOwnProperty('username')){

        return res.status(400).send({message: 'Invalid request, missing one or more required field(s).'});  
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(requestBody.userEmail)) {
        return res.status(400).send({ message: 'Invalid email format.' });
    }

    // Validate password (at least one uppercase letter and one number)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(requestBody.password)) {
        return res.status(400).send({ message: 'Password must contain at least one uppercase letter and one number.' });
    }

    try{
        const user = req.body;
        const result = await createUser(requestBody);        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})    

const onFindOneUser = (async (req, res) => {
    const userId = req.params["userId"];
    //check for required poperies 
    if (!userId){
        return res.status(400).send({message: 'Invalid request, missing user id.'});  
    }
    
    try{
        const result = await findOneUser(userId);
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})   

const onFindOneUserbyEmail = (async (req, res) => {
    const requestBody = req.body;
    
    //check for required poperies 
    if (!requestBody.hasOwnProperty('email')){
        return res.status(400).send({message: 'Invalid request, missing user email.'});  
    }
    
    try{
        const result = await findOneUserbyEmail(requestBody.hasOwnProperty('email'));
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})

const onFindUsers = (async (req, res) => {    
    try{
        const result = await findUsers();
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})  

const onLastLogin = (async (req, res) => {
    const userId = req.params["userId"];  
    try{
        const result = await lastLogin(userId);
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})


module.exports = {onRegister, onFindOneUser, onFindUsers, onLastLogin,onFindOneUserbyEmail };
