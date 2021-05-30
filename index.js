const { ApolloServer, gql} = require('apollo-server-express');
const express= require('express');




const mongoose= require('mongoose');

const {MONGODB}= require("./config");
const typeDefs= require('./GraphQL/typeDefs');
const resolvers= require('./GraphQL/Resolvers');
const cors= require('cors');



const server= new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});

const app= express()
server.applyMiddleware({ app })

app.use(express.static('public'))
app.use(cors())

const PORT= process.env.PORT || 5000


mongoose.connect(MONGODB, { useNewUrlParser: true })
.then(() => {
    console.log('MongoDB connected!');
    return app.listen({ port:PORT })
})
.then(() => {
    console.log(`Server running at http://localhost:5000`)
}).catch(err => {
    console.log(err);
})