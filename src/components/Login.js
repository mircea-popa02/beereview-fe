import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Get access to the navigate object

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the form inputs are empty
    var inputs = document.querySelectorAll('input');
    var isValid = true;

    inputs.forEach((input) => {
        if (input.type !== 'submit' && input.value.trim() === '') {
            setError('Please fill out the ' + input.id + ' field.');
            isValid = false;
            input.focus();
            return false;
        }
    });

    if (isValid) {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
          throw new Error('Invalid username or password');
        }

        const data = await response.json();
        const { token } = data;
        localStorage.setItem('token', token);

        // Redirect the user to the home page or another page
        navigate('/home');
      } catch (error) {
        setError('Invalid username or password');
        console.error('Error logging in:', error);
      }
    };
  }

  return (
    <div className="login_box">
      <img src={logo} alt="Logo"></img>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red', fontWeight: 500 }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>

      <div className="bottom">
        <p>
        New around here? <a href='/register'>Sign up!</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
