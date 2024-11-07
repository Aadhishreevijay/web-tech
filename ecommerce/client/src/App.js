/*import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Auth from './components/Auth';
import Products from './components/Products';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path ='/auth' element={<Auth />}></Route>
          <Route path ='/products' element={<Products />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Products from './components/Products';
import Cart from './components/cart'; // Import Cart component
import Wishlist from './components/Wishlist'; // Import Wishlist component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} /> {/* Route for Cart */}
          <Route path="/wishlist" element={<Wishlist />} /> {/* Route for Wishlist */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

