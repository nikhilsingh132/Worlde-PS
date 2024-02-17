import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import "./App.css"

const socket = io.connect("https://chat-app-v28e.onrender.com");

function ChatApp() {
    const [userCount, setUserCount] = useState(0);
    const [chatMessages, setChatMessages] = useState([]);
    const [username, setUsername] = useState('anonymous');
    const [messageInput, setMessageInput] = useState('');

    useEffect(() => {
        socket.on('user-count', (data) => {
            setUserCount(data);
        });

        socket.on('chat-message', (data) => {
            setChatMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off('user-count');
            socket.off('chat-message');
        };
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() === '') return;
        const data = {
            username,
            message: messageInput,
            dateTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
        };
        socket.emit('message', data);
        setMessageInput('');
    };

    return (
        <div className="container">
            <h1>Chatbot💬</h1>
            <div className='userfield'>
            <p className='username'>Username</p>
            <input
                type="text"
                name="user"
                id="user-input"
                className="user-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="chat-container">
            {chatMessages.length === 0 ? (
                    <p className="chat-placeholder">CHAT HERE</p>
                ) : (
                    <ul className="message-container">
                        {chatMessages.map((message, index) => (
                            <li key={index} className={message.username === username ? 'message-right' : 'message-left'}>
                                <span>{message.username}</span>
                                <p>{message.message}</p>
                                <p className='datetime'>{message.dateTime}</p>
                            </li>
                        ))}
                    </ul>
                )}
                <form className="message-form" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
            <h3>Total users: {userCount}</h3>
        </div>
    );
}

export default ChatApp;
