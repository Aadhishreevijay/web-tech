import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();

  const courses = [
    { id: 1, name: 'React Basics', description: 'Learn the basics of React.' },
    { id: 2, name: 'Advanced JavaScript', description: 'Deep dive into JavaScript.' },
    { id: 3, name: 'Web Development with HTML & CSS', description: 'Master HTML and CSS.' },
    { id: 4, name: 'React Basics', description: 'Learn the basics of React.' },
    { id: 5, name: 'Advanced JavaScript', description: 'Deep dive into JavaScript.' },
    { id: 6, name: 'Web Development with HTML & CSS', description: 'Master HTML and CSS.' },
  ];

  return (
    <div className="courses-container">
      <h2>Available Courses</h2>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <h3>{course.name}</h3>
            <p>{course.description}</p>
            <button onClick={() => alert(`Enrolled in ${course.name}!`)}>Enroll</button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/forum')} className="forum-button">
        Go to Discussion Forum
      </button>
    </div>
  );
};

export default Courses;
