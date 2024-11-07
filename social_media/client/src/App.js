import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import Post  from './components/Post';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth"/>}/>
          <Route path="/auth" element={<Auth/>} />
          <Route path="/posts" element={<Post/>}
          />
        </Routes>
    </Router>
  );
};

export default App;