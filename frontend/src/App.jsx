import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import UserPage from './pages/UserPage/UserPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    fetch('https://web-final-backend.onrender.com/api/users/isLoggedIn', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => setUser(data.username));
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/user/:username" element={<UserPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
