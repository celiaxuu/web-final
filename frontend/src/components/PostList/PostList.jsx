import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PostList.css';

export default function PostList({ posts, currentUser, onPostDeleted, onPostEdited }) {
  const [editingPostId, setEditingPostId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        onPostDeleted(postId);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: editContent })
      });
      
      if (response.ok) {
        const updatedPost = await response.json();
        onPostEdited(postId, updatedPost);
        setEditingPostId(null);
        setEditContent('');
      }
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditContent(post.content);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="post-list">
      {posts && posts.map(post => (
        <div key={post._id} className="post-item">
          <div className="post-header">
            <Link to={`/user/${post.username}`} className="post-username">
              {post.username}
            </Link>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
          {editingPostId === post._id ? (
            <div className="edit-post-form">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={280}
              />
              <div className="edit-buttons">
                <button onClick={() => handleEdit(post._id)}>Save</button>
                <button onClick={() => setEditingPostId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="post-content">{post.content}</p>
              {currentUser === post.username && (
                <div className="post-actions">
                  <button 
                    onClick={() => startEditing(post)} 
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(post._id)} 
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}