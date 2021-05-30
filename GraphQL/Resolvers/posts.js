const Post= require('../../Models/Post');
const checkAuth= require('../../Utils/checkAuth');
const {AuthenticationError, UserInputError}= require('apollo-server');
const User= require('../../Models/User');
const path= require('path');
const fs= require('fs');
const randomStringGen= require('../../Utils/RandomFilename');






module.exports ={
    Query: {
        async getUserPosts(_, {}, context){
            const user= checkAuth(context);

            if(user){
                try{
                    let posts= await Post.find().sort({createdAt: -1});

                    

                    return posts;
                }catch(err){
                    throw new Error(err);
                }
            }else{
                throw new UserInputError("No user found!");
            }
        },
        async getPosts(){
            try{

                

                

                    let posts= await Post.find().sort({ createdAt: -1 });
                

                    return posts;
               
                
                
            }catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, {postId}){
            try{
                let post= await Post.findById(postId);
                if(post){

                    return post;
                }else{
                    throw new Error('Post not found!')
                }
            }catch(err){
                throw new Error(err);
            }
        },
        hello: () => 'Hello World',

    },
    Mutation: {
        async createPost(_, {caption, imageURL}, context){
            const user= checkAuth(context);
           

            

            if(imageURL.trim=== ""){
                throw new UserInputError("Please provide an image");
            }

            if(caption.trim === ""){
                throw new UserInputError("Please provide a caption!");
            }

            const newPost = new Post({
                caption,
                imageURL,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });


            const post = newPost.save();

            return post;
        },
        async deletePost(_, {postId}, context){
            const user= checkAuth(context);


            try{
                const post= await Post.findById(postId);
                if(user.username=== post.username){
                    await post.delete();
                    return "Post deleted successfully";
                }else{
                    throw new AuthenticationError('Action not allowed!');
                }
            }catch(err){
                throw new Error(err);
            }
        },
        async likePost(_, {postId}, context){
            const {username}= checkAuth(context);


            const post= await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username=== username)){
                    const likedpost= post.likes.filter(like => like.username !== username);

                    post.likes= likedpost;
                }else{
                    post.likes.push({
                        username, 
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();

                return post;
            }else{
                throw new UserInputError('Post not found!')
            }
        },
        async fileUpload(parent, {file}){
            const {createReadStream, filename} = await file;

            const stream = createReadStream();

            const {ext}= path.parse(filename);

            const randomName= randomStringGen(12) + ext;

            const pathName= path.join(__dirname, `../../public/images/${randomName}`)
            await stream.pipe(fs.createWriteStream(pathName))

            return {
                url: `http://localhost:5000/images/${randomName}`,
            }
        }
    }
}


