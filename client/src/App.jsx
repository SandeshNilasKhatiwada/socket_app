import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<Login setToken={setToken} setUsername={setUsername} />}
        />
        <Route path='/register' element={<Register />} />
        <Route
          path='/chat'
          element={
            <Chat token={token} username={username} onLogout={handleLogout} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
