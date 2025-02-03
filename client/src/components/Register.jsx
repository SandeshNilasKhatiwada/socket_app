import React, { useState } from 'react';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser({ username, email, password });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setMessage('Registration failed.');
    }
  };

  return (
    <Container maxWidth='xs' style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom>
          Register
        </Typography>
        {message && <Typography color='success'>{message}</Typography>}
        <TextField
          fullWidth
          label='Username'
          margin='normal'
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label='Email'
          margin='normal'
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label='Password'
          type='password'
          margin='normal'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleRegister}
          style={{ marginTop: '10px' }}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}

export default Register;
