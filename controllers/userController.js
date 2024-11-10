const {createUser, findOneUser, findUsers } = require('../models/userModel.js')

const onRegister = (async (req, res) => {
    const requestBody = req.body;
    //check for required poperies 
    if (!requestBody.hasOwnProperty('userEmail') || !requestBody.hasOwnProperty('password') ||
        !requestBody.hasOwnProperty('username')){

        return res.status(400).send({message: 'Invalid request, missing one or more required field(s).'});  
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

const onFindUsers = (async (req, res) => {    
    try{
        const result = await findUsers();
        
        res.status(200).send(result);  
    } catch (error) {
        res.status(error.statusCode).send({message: error.message});  
    }
    return;
})  



module.exports = {onRegister, onFindOneUser, onFindUsers};
