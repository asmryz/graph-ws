const {gql} = require('apollo-server-express')

module.exports = gql`
    type Message{
        text: String
        createdBy: String
    }

    input MessageInput{
        text: String
        username: String
    }

    type Query{
        messages: [Message!]!
    }

    type Mutation{
        createMessage(messageInput: MessageInput): Message!
    }

    type Subscription{
        messageCreated: Message
    }
`