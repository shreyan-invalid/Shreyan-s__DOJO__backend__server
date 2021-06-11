const User= require('../../Models/User');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const {SECRET_KEY}= require('../../config')
const imageURL= "default";
const { UserInputError }= require('apollo-server');
const {validateRegisterInput, validateLoginInput}= require('../../Utils/Validators');
const checkAuth= require('../../Utils/checkAuth');

const Post= require('../../Models/Post');

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        imageURL: user.imageURL,
        bio: user.bio
    }, SECRET_KEY, { expiresIn: "1h"});
}

module.exports= {
    Mutation: {
        async updateBio(_,{bio}, context){

            const user= checkAuth(context);

            if(user){

                const updatedUser= await User.findById(user.id);

                updatedUser.bio= bio;

                await updatedUser.save();

                return updatedUser;

            }else{
                throw new UserInputError("Invalid user/ user not found!")
            }
        },
        async updateProfilePic(_, {imageURL}, context){

            const user= checkAuth(context);

            if(user){

                const userToUpdate= await User.findById(user.id);

                userToUpdate.imageURL= imageURL;


                await userToUpdate.save();

                return userToUpdate;
            }else{
                throw new UserInputError("User not found!");
            }
        },
        async login(_, {username, password}){
            const {errors, valid}= validateLoginInput(username, password);

            if(!valid){
                throw new UserInputError('Errors', {errors});
            }
            const user= await User.findOne({ username });

            if(!user){
                errors.general= "Users not found!";
                throw new UserInputError("Wrong credentials", {errors});
            }else{
                const match= await bcrypt.compare(password, user.password);
                if(!match){
                    errors.general= "Wrong Credentials";
                    throw new UserInputError("Wrong Credentials", {errors});
                }


                const token= generateToken(user);


                return {
                    ...user._doc,
                    id: user._id,
                    token
                }
            }
        },
        async register(_, {
                registerInput: {
                username, email, password, confirmPassword
            }}, 
            context, 
            info
        ){

            const {valid, errors}= validateRegisterInput(username, 
                email, 
                password, 
                confirmPassword
            );

            if(!valid){
                throw new UserInputError('Error', {errors})
            }

            const user= await User.findOne({username});

            if(user){
                throw new UserInputError('username is taken', {
                    errors: {
                        username: 'This username is taken!'
                    }
                })
            }else{

            }
            password= await bcrypt.hash(password, 12);

            const newUser= new User({
                email, 
                username,
                password,
                createdAt: new Date().toISOString(),
                imageURL: imageURL,
                bio: ""
            });

            const res= await newUser.save();

            const token = generateToken(res);


            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        async followUser(_, {userId}, context){
            

            const user= checkAuth(context);

            if(user){
                const userFollowing= await User.findById(user.id)
                const userToFollow=  await User.findById(userId);

                if(!userFollowing || !userToFollow){
                    throw new UserInputError('User not found!')
                }else{

                    try{

                        if(userFollowing.followings.find(following => following.username===userToFollow.username)){

                            

                            try{

                                

                               

                                const newFollwing= userFollowing.followings.filter(following => following.username!== userToFollow.username);

                                userFollowing.followings= newFollwing;
                                
                                await userFollowing.save();

                            }catch(err){
                                throw new UserInputError("Cound't update");
                            }

                        }else{

                            userFollowing.followings.push({
                                username: userToFollow.username,
                                createdAt: new Date().toISOString()
                            })

                        }
                        

                       
                    }catch(err){
                        throw new UserInputError("userFollowing not found!");
                    }

                    try{

                        if(userToFollow.followers.find(follower => follower.username === userFollowing.username)){

                            try{

                                

                                const newFollowers= userToFollow.followers.filter(follower => follower.username!== userFollowing.username);

                                userToFollow.followers= newFollowers;

                                await userToFollow.save();

                            }catch(err){
                                throw UserInputError("Coudn't update!")
                            }
                            

                        }else {

                            userToFollow.followers.push({
                                username: userFollowing.username,
                                createdAt: new Date().toISOString()
                            })

                        }
                        

                        
                    }catch(err){
                       throw new UserInputError("usertofollow not found!");
                    }
                    
                    await userFollowing.save();
                    await userToFollow.save();
                    
                    return userToFollow;
                    
                }
            }else{
                throw new UserInputError("User not found!")
            }

            

        },
        
        
    },
    Query: {
        async getUsers(_, {}, context){
            try{

                let users= await User.find().sort({ createdAt: -1 });

                return users;

            }catch(err){
                throw new Error(err);
            }
        },

        async getUser(_, {userId}, context){
            const user= checkAuth(context);

            if(!userId){
                if(user){
                    const retUser= User.findOne({username: user.username})
    
                    return retUser;
                }else{
                    throw new UserInputError("Authentication error!");
                }
            }else if(userId){
                const retUser= User.findOne({_id: userId});

                return retUser;
            }else{
                throw new UserInputError("Not authorized to fetch this data!");
            }
            
        },
        async getProfilePic(_, {username}, context){
            
            const user= await User.findOne({username: username});

            if(user){
                
                return user.imageURL;
            }else{
                throw new UserInputError("User not found!");
            }
        }
        
    }
}