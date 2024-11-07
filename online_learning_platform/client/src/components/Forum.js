import React, { useState, useEffect } from 'react';
import './Forum.css';

const Forum = () => {
  const [question, setQuestion] = useState('');
  const [discussions, setDiscussions] = useState([]);

  // Load discussions from localStorage on component mount
  useEffect(() => {
    const storedDiscussions = localStorage.getItem('discussions');
    if (storedDiscussions) {
      setDiscussions(JSON.parse(storedDiscussions));
    }
  }, []);

  // Save discussions to localStorage whenever discussions state changes
  useEffect(() => {
    localStorage.setItem('discussions', JSON.stringify(discussions));
  }, [discussions]);

  const handlePostQuestion = (e) => {
    e.preventDefault();

    if (question.trim() === '') {
      alert('Question cannot be empty');
      return;
    }

    const newDiscussion = {
      id: Date.now(), // Unique ID
      question,
      createdAt: new Date().toLocaleString(),
    };

    setDiscussions([newDiscussion, ...discussions]); // Add new question at the top
    setQuestion(''); // Clear input
  };

  return (
    <div className="forum-container">
      <h2>Discussion Forum</h2>
      <form onSubmit={handlePostQuestion} className="forum-form">
        <textarea
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows="3"
          required
        />
        <button type="submit">Post Question</button>
      </form>

      <h3>Discussion History</h3>
      <div className="discussions-list">
        {discussions.length === 0 ? (
          <p>No discussions yet! Be the first to ask a question.</p>
        ) : (
          discussions.map((discussion) => (
            <div key={discussion.id} className="discussion-card">
              <p>{discussion.question}</p>
              <small>Posted on {discussion.createdAt}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Forum;
