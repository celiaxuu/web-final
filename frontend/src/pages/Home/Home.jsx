import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PostForm from '../../components/PostForm/PostForm';
import PostList from '../../components/PostList/PostList';
import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/users/isLoggedIn', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setUser(data.username))
      .catch(error => console.error('Error checking login status:', error));

    fetch('http://localhost:8000/api/posts', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
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
      <>
        <Navbar user={user} />
        <div className="loading-container">Loading...</div>
      </>
    );
  }

  return (
    <div>
      <Navbar user={user} />
      <div className="home-container">
        {user && (
          <PostForm onPostCreated={handlePostCreated} />
        )}
        <PostList
          posts={posts}
          currentUser={user}
          onPostDeleted={handlePostDeleted}
          onPostEdited={handlePostEdited}
        />
      </div>
    </div>
  );
}