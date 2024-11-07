import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Courses from './components/Courses';
import Forum from './components/Forum';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth"/>}/>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/forum" element={<Forum />} />
        </Routes>
    </Router>
  );
};

export default App;
