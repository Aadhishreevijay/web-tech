import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import Auth from './componenets/Auth';
import Jobs  from './componenets/Jobs';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Navigate to="/auth"/>}/>
          <Route path='/auth' element={<Auth/>}/>
          <Route path='/jobs' element={<Jobs/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
