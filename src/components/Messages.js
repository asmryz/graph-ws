import React, {useState}from 'react'
import {gql, useSubscription} from '@apollo/client';


const MESSAGES_SUBSCRIPTION = gql `
    subscription MessageCreated {
        messageCreated {
            text
            createdBy
        }
    }
`

const Messages = () => {
    const [messages, setMessages] = useState([])
    const {loading} = useSubscription(
        MESSAGES_SUBSCRIPTION, 
        {
            onSubscriptionData: (data) =>{
                //const message = data.subscriptionData.data.messageCreated;
                setMessages([...messages, data.subscriptionData.data.messageCreated])
            }
        }
    )

    return(
        <div>
            <div>Messages!!!</div>
            {!loading && messages.map((msg, index) => (<div key={index}>
            <strong>{msg.createdBy}</strong>
            &nbsp;
            says
            &nbsp;
            <strong>{msg.text}</strong>
            </div>))}
        </div>
    )
}

export default Messages;