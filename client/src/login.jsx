import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken, setUsername, setShowLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setToken(res.data.token);
      setUsername(res.data.username);
      localStorage.setItem('token', res.data.token);
    } catch (error) {
      setMessage(
        'Login failed: ' + (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <input
        type='email'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>
        Don't have an account?{' '}
        <button onClick={() => setShowLogin(false)}>Register</button>
      </p>
    </div>
  );
}

export default Login;
