// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding'
import ReviewPage from "./pages/ReviewPage";
import DegreePlanner from "./pages/DegreePlanner";



function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="flex gap-x-4 text-xl">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/onboarding">On-boarding</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/degree">Degree</Link>
      </div>



      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the login page */}
        <Route path="/login" element={<Auth user={user} setUser={setUser} />} />
        
        {/* Route for the onboarding page */}
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Route for the review page */}
        <Route path="/reviews" element={<ReviewPage />} />

        <Route path="/degree" element={<DegreePlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
