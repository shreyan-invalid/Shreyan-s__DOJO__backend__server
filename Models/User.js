const {model, Schema}= require('mongoose');


const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    imageURL: String,
    bio: String,
    followers: [
        {
            username: String,
            createdAt: String
        }
    ],
    followings: [
        {
            username: String,
            createdAt: String
        }
    ]
})

module.exports = model('User', userSchema);