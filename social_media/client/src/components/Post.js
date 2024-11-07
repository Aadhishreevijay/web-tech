import React, { useState, useEffect } from 'react';
import './Post.css';

const Post = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // Load posts from localStorage on component mount
  useEffect(() => {
    const storedPosts = localStorage.getItem('allPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  // Save posts to localStorage whenever posts state changes
  useEffect(() => {
    localStorage.setItem('allPosts', JSON.stringify(posts));
  }, [posts]);

  const handleCreatePost = (e) => {
    e.preventDefault();

    if (postContent.trim() === '') {
      setError('Post content cannot be empty');
      return;
    }

    const newPost = {
      id: Date.now(), // Unique ID based on current timestamp
      content: postContent,
      createdAt: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]); // Add new post at the beginning of the array
    setPostContent(''); // Clear input field
    setError(''); // Reset error message
  };

  return (
    <div className="post-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleCreatePost} className="post-form">
        <textarea
          placeholder="What's on your mind?"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows="4"
          required
        />
        <button type="submit">Post</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h3>All Posts</h3>
      <div className="posts-list">
        {posts.length === 0 ? (
          <p>No posts yet! Be the first to create one.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post">
              <p>{post.content}</p>
              <small>Posted on {post.createdAt}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Post;
