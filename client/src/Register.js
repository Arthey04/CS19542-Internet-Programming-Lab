import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import axios from 'axios'; // Import axios for making HTTP requests
import './Registration.css'; // Import the CSS file for styling

const Register = () => {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const navigate = useNavigate(); // Initialize useNavigate to handle redirection

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to backend API for registration
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // If registration is successful, status will be 201 or similar
      if (response.status === 201) {
        console.log('User registered successfully');
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        console.error('Registration error:', response.data.error);
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      if (error.response) {
        // Server-side error
        console.error('Server error:', error.response.data.error);
        alert(`Error: ${error.response.data.error}`);
      } else {
        // Network error
        console.error('Network error:', error.message);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
      </form>
    </div>
  );
};

export default Register;
