import React, { useState, FormEvent, useEffect } from 'react';
import { useSelector } from "react-redux";
import { RootState } from '../../types/combinedStoreTypes';
import { getMsgsByProfileIdAndReceiverId, addMsg } from './../../utils/userDatabaseFetch';
import { ChatInterface } from './../../types/component';
import { Message } from './../../types/user';
import './chat.css';

export const Chat = (props: ChatInterface): JSX.Element => {
  const currentUser = useSelector((state: RootState) => state.user)
  const [message, setMessage] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);

  useEffect(() => {
    if (currentUser.profile.id) {
      getMsgsByProfileIdAndReceiverId(currentUser.profile.id, props.location.state.id)
        .then((msgs: Message[]) => {
          setConversation(msgs)
        })
    }
  }, [currentUser.profile, props.location.state.id])

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.target;
    setMessage(value);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const messageToSend = {
      text: message,
      profileId: currentUser.profile.id,
      targetId: props.location.state.id
    }
    const messageTosave = {
      id: Math.random(),
      text: message,
      profileId: Number(currentUser.profile.id),
      receivedMessageId: props.location.state.id,
      sentMessageId: Number(currentUser.profile.id),
      createdAt: 'from front end',
      updatedAt: 'from front end'
    }
    addMsg(messageToSend)
    setConversation([...conversation, messageTosave])
    setMessage('')
  };

  return (
    <div id="chat-area">
      <div id="test">
        <form onSubmit={handleSubmit}>
          <input
            id="chat-input-field"
            name="message"
            placeholder="New message"
            value={message}
            onChange={handleChange}
          ></input>
          <button id="sendMessageBtn">Send</button>
        </form>
      </div>

      <div id="chat-messages-area" >
        {conversation.map((el, i) => {
          return (
            <div id="chat-container" key={i}>
              <div id="userName">{el.sentMessageId === currentUser.profile.id ?
                <div id="chatter-current-user">{currentUser.firstName}</div>
                : <div id="chatter-other-user">{props.location.state.firstName}</div>}
              </div>

              <div id="chat">
                {el.sentMessageId === currentUser.profile.id ?
                  <div id="chat-message-box-current">{el.text}</div>
                  : <div id="chat-message-box-other">{el.text}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}