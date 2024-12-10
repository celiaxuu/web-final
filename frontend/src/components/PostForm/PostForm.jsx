import React, { useState } from 'react';
import './PostForm.css';

export default function PostForm({ onPostCreated }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const res = await fetch('http://localhost:8000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content })
    });

    if (res.ok) {
      const post = await res.json();
      onPostCreated(post);
      setContent('');
    }
  };

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's happening?"
        maxLength={280}
      />
      <div className="post-form-footer">
        <span className="character-count">
          {content.length}/280
        </span>
        <button type="submit">Post</button>
      </div>
    </form>
  );
}