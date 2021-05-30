const {gql} = require('apollo-server');


module.exports= gql`
    type File{  
        url: String!
    }
    type Post{
        id: ID!
        caption: String!
        username: String!
        createdAt: String!
        imageURL: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
    }
    type Comment{
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }
    type Like{
        id: ID!
        createdAt: String!
        username: String!
    }
    type User{
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        imageURL: String!
        followers: [follower]!
        followings: [following]!
        bio: String!
        followingsCount: Int!
        followersCount: Int!
    }
    type follower{
        id: ID!
        createdAt: String!
        username: String!
    }
    type  following{
        id: ID!
        createdAt: String!
        username: String!
    }
    input RegisterInput{
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query{
        getPosts: [Post]
        getPost(postId: ID!):Post
        getUsers: [User]
        getUserPosts: [Post]
        hello: String!
        getUser(userId: ID): User
        getProfilePic(username: String): String
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(caption: String!, imageURL: String!): Post!
        deletePost(postId: ID!):String!
        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
        followUser(userId: ID!): User!
        updateProfilePic(imageURL: String!): User!
        fileUpload(file: Upload!): File!
        updateBio(bio: String!): User!
    }
`;