import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PostList from '../../components/PostList/PostList';
import './UserPage.css';

export default function UserPage() {
  const [userData, setUserData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const { username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResponse = await fetch('https://web-final-backend.onrender.com/api/users/isLoggedIn', {
          credentials: 'include'
        });
        const loginData = await loginResponse.json();
        setCurrentUser(loginData.username);
        
        const [userRes, postsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/users/${username}`, { 
            credentials: 'include' 
          }),
          fetch(`https://web-final-backend.onrender.com/api/users/${username}/posts`, { 
            credentials: 'include' 
          })
        ]);

        if (!userRes.ok) {
          throw new Error('User not found');
        }

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        setUserData(userData);
        setDescription(userData.description || '');
        setPosts(postsData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const handleUpdateDescription = async () => {
    try {
      const res = await fetch(`https://web-final-backend.onrender.com/api/users/${username}/description`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ description })
      });

      if (!res.ok) {
        throw new Error('Failed to update description');
      }

      setIsEditing(false);
      setUserData(prev => ({ ...prev, description }));
    } catch (err) {
      console.error('Error updating description:', err);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  const handlePostEdited = (postId, updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div>
        <Navbar user={currentUser} />
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar user={currentUser} />
        <div className="error-container">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={currentUser} />
      <div className="user-page">
        <div className="user-header">
          <h1>{userData.username}</h1>
          <div className="join-date">
            Joined: {new Date(userData.createdAt).toLocaleDateString()}
          </div>
          <div className="description-section">
            {currentUser === username && isEditing ? (
              <div className="edit-description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  placeholder="Write something about yourself..."
                />
                <div className="edit-buttons">
                  <button onClick={handleUpdateDescription}>Save</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="description-display">
                <p>{userData.description || 'No description yet.'}</p>
                {currentUser === username && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="edit-button"
                  >
                    Edit Description
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="user-posts">
          <h2>Posts</h2>
          <PostList
            posts={posts}
            currentUser={currentUser}
            onPostDeleted={handlePostDeleted}
            onPostEdited={handlePostEdited}
          />
        </div>
      </div>
    </div>
  );
}