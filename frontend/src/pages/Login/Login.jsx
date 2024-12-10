import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        window.location.href = '/';
        return;
      }

      if (res.status === 401) {
        setError("User not found");
      } else if (res.status === 403) {
        setError("Invalid password");
      } else {
        const data = await res.text();
        setError(data || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e, setter) => {
    setError('');
    setter(e.target.value);
  };

  return (
    <>
      <Navbar user={null} />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => handleInputChange(e, setUsername)}
            disabled={isSubmitting}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
            disabled={isSubmitting}
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </>
  );
}