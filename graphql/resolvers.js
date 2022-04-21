const Message = require('../models/Message');
const {PubSub} = require('graphql-subscriptions');

const pusub = new PubSub();

module.exports={
    Mutation:{
        async createMessage(parent, {messageInput:{text, username}}){
            const newMessage = new Message({
                text: text, 
                createdBy: username
            });

            const res = await newMessage.save();

            pusub.publish('MESSAGE_CREATED', {
                messageCreated:{
                    text: text, 
                    createdBy: username
                }
            })

            return{
                id: res.id, 
                ...res._doc
            }
        }
    }, 
    Subscription:{
        messageCreated:{
            subscribe: () => pusub.asyncIterator('MESSAGE_CREATED')
        }
    }, 
    Query:{
        messages:async ()=> await Message.find()
    }
}