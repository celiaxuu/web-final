import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://web-final-backend.onrender.com/api/users/logOut', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        navigate('/');
        setTimeout(() => window.location.reload(), 100);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">TwitterClone</Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to={`/user/${user}`} className="navbar-username">
                {user}
              </Link>
              <button onClick={handleLogout} className="navbar-button logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-button login">Login</Link>
              <Link to="/register" className="navbar-button register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}