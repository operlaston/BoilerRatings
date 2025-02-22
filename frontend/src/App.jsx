// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <Router>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/onboarding">On-boarding</Link>

      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the login page */}
        <Route path="/login" element={<Auth />} />

        {/* Route for the onboarding page */}
        <Route path="/onboarding" element={<Onboarding />} />


      </Routes>
    </Router>
  );
}

export default App;
