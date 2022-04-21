const { createServer } = require('http');
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const { PubSub } = require('graphql-subscriptions');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const resolvers = require('./graphql/resolvers.js');
const typeDefs = require('./graphql/typeDefs.js');
const mongoose = require('mongoose')

const PORT = 4000;
const pubsub = new PubSub();

const MONGODB_URI = "mongodb://localhost:27017/Messenger";

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });
// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);
// Set up WebSocket server.
const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
});
const serverCleanup = useServer({ schema }, wsServer);
// Set up ApolloServer.
const server = new ApolloServer({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});
(async()=>{
    await server.start();
    server.applyMiddleware({ app });
    await mongoose.connect(MONGODB_URI);
})();

// Now that our HTTP server is fully set up, actually listen.
httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`);
    //console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`);
});
// In the background, increment a number every second and notify subscribers when
// it changes.
// let currentNumber = 0;
// function incrementNumber() {
//     currentNumber++;
//     pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
//     setTimeout(incrementNumber, 1000);
// }
// // Start incrementing
// incrementNumber();
