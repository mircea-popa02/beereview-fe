import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import '../styles/Register.css';

const Register = () => {
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
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
          throw new Error('Invalid username or password');
        }
        
        // Redirect the user to the home page or another page
        navigate('/login');
      } catch (error) {
        setError('Invalid username or password');
        console.error('Error logging in:', error);
      }
    }
  };

  return (
    <div className='register_box'>
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
        <button type="submit">Create Account</button>
      </form>

      <div className="bottom_elem">
        <p>
        You must be of legal drinking age in your country to join BeerReview.
        By clicking Create Account, you agree to our <button>Terms of Use</button> and our <button>Privacy Policy</button>.
        </p>
      </div>
    </div>
  );
};

export default Register;
