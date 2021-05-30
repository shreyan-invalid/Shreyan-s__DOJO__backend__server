const postResolvers = require('./posts');
const userResolvers = require('./users');
const commentResolvers= require('./comment');

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    User: {
        followingsCount: (parent) => parent.followings.length,
        followersCount: (parent) => parent.followers.length
    },
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation
    }
}