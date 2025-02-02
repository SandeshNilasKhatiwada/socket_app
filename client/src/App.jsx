import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './login';
import Register from './register';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showLogin, setShowLogin] = useState(true); // Control login/register page visibility

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token },
      });

      newSocket.on('receive_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      setSocket(newSocket);

      return () => newSocket.disconnect();
    }
  }, [token]);

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('send_message', message);
      setMessage('');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {!token ? (
        showLogin ? (
          <Login
            setToken={setToken}
            setUsername={setUsername}
            setShowLogin={setShowLogin}
          />
        ) : (
          <Register setShowLogin={setShowLogin} />
        )
      ) : (
        <div>
          <h2>Welcome, {username}</h2>
          <div
            style={{
              marginBottom: '20px',
              height: '200px',
              overflowY: 'auto',
              border: '1px solid black',
              padding: '10px',
            }}
          >
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <input
            type='text'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Type a message...'
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
