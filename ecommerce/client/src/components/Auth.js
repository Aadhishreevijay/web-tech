/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setSuccess('Login successful!');
      setError('');
      navigate('/products'); // Redirect to products page
    } catch (err) {
      setError('Invalid credentials');
      setSuccess('');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', { username, password });
      setSuccess('User registered successfully!');
      setError('');
    } catch (err) {
      setError('Error registering user');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <h2>{activeTab === 'login' ? 'Login' : 'Signup'}</h2>
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`} 
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button 
          className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`} 
          onClick={() => setActiveTab('signup')}
        >
          Signup
        </button>
      </div>
      <form onSubmit={activeTab === 'login' ? handleLogin : handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{activeTab === 'login' ? 'Login' : 'Signup'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Auth;*/


/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Mock users database and a token
  const mockUsers = [
    { username: 'testuser', password: 'password123' },
  ];
  const mockToken = 'dummy_token';

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      localStorage.setItem('token', mockToken);
      setSuccess('Login successful!');
      setError('');
      navigate('/products');
    } else {
      setError('Invalid credentials');
      setSuccess('');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const userExists = mockUsers.some((user) => user.username === username);
    if (!userExists) {
      mockUsers.push({ username, password });
      setSuccess('User registered successfully!');
      setError('');
    } else {
      setError('User already exists');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <h2>{activeTab === 'login' ? 'Login' : 'Signup'}</h2>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          Signup
        </button>
      </div>
      <form onSubmit={activeTab === 'login' ? handleLogin : handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{activeTab === 'login' ? 'Login' : 'Signup'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Auth;*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Load users from localStorage or initialize with a default user
  const getUsersFromStorage = () => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [{ username: 'testuser', password: 'password123' }];
  };

  const [users, setUsers] = useState(getUsersFromStorage);

  // Save updated users to localStorage whenever users state changes
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      localStorage.setItem('token', 'dummy_token'); // Mock token
      setSuccess('Login successful!');
      setError('');
      navigate('/products');
    } else {
      setError('Invalid credentials');
      setSuccess('');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const userExists = users.some((user) => user.username === username);
    if (!userExists) {
      const newUser = { username, password };
      setUsers([...users, newUser]);
      setSuccess('User registered successfully!');
      setError('');
    } else {
      setError('User already exists');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <h2>{activeTab === 'login' ? 'Login' : 'Signup'}</h2>
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
        >
          Signup
        </button>
      </div>
      <form onSubmit={activeTab === 'login' ? handleLogin : handleSignup} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{activeTab === 'login' ? 'Login' : 'Signup'}</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Auth;


