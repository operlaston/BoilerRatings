// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import EmailVerify from "./pages/EmailVerify";
import ReviewPage from "./pages/ReviewPage.jsx";

function App() {
  return (
    <Router>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/verify">Verify</Link>

      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the login page */}
        <Route path="/login" element={<Auth />} />

        {/* Route for the email verification page */}
        <Route path="/verify" element={<EmailVerify />} />

        {/* Route for the review page */}
        <Route path="/reviews" element={<ReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
