//import './App.css';
import React from 'react'
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Messages from './components/Messages';

const link = new GraphQLWsLink(
    createClient({
        url: "ws://localhost:4000/graphql",
    }),
);



const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    link,
    cache: new InMemoryCache()
});



function App() {
    return (
        <div className="App">
            <p>Comment will load in below</p>
            <Messages />
        </div>
    );
}

export default () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)