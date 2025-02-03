import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { fetchMessages, sendMessageApi } from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

function Chat({ token, username, onLogout }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [fetchedMessages, setFetchedMessages] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch messages from MongoDB only once
    if (!fetchedMessages) {
      fetchMessages()
        .then((res) => {
          setMessages(res.data);
          setFetchedMessages(true);
        })
        .catch((err) => console.error('Error fetching messages:', err));
    }

    // Connect to Socket.IO only if it's not already connected
    if (!socket) {
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        auth: { token },
      });

      // Ensure messages are received only once
      newSocket.on('receive_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });

      setSocket(newSocket);
    }

    return () => {
      if (socket) {
        socket.off('receive_message'); // Prevent multiple event listeners
        socket.disconnect();
      }
    };
  }, [token, navigate, fetchedMessages]);

  const sendMessage = async () => {
    if (message.trim() && socket) {
      const messageData = { username, message };

      try {
        await sendMessageApi(messageData); // Save message via API
        socket.emit('send_message', messageData);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <Container maxWidth='sm' style={{ marginTop: '50px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h5'>Welcome, {username}</Typography>
          <Button variant='outlined' color='secondary' onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <List
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            padding: '10px',
          }}
        >
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${msg.username}: ${msg.message}`} />
            </ListItem>
          ))}
        </List>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <TextField
            fullWidth
            label='Type a message...'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={sendMessage}
            style={{ marginLeft: '10px' }}
          >
            Send
          </Button>
        </div>
      </Paper>
    </Container>
  );
}

export default Chat;
