const { doTypesOverlap } = require('graphql');
const jwt= require('jsonwebtoken');
const {SECRET_KEY}= require('../config');
const {AuthenticationError}= require('apollo-server');


module.exports = (context) => {
    

    const AuthHeader= context.req.headers.authorization;

    if(AuthHeader){
        
        const token = AuthHeader.split('Bearer ')[1];

        if(token){
            try{

                const user= jwt.verify(token, SECRET_KEY);
                console.log(user);
                return user

            }catch(err){
                throw new AuthenticationError('Invalid/Expired user');
            }
        }else{
            throw new Error('Authentication token must be provided');
        }
    }else{
        throw new Error('Authentication Header must be provided');
    }
}