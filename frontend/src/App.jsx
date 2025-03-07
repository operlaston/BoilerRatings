import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import ReviewPage from "./pages/ReviewPage";
import DegreePlanner from "./pages/DegreePlanner";
import CourseInfo from './pages/Course';
import SavedDegree from './pages/SavedDegree';

function App() {
  const [user, setUser] = useState(null)
  const [degreePlan, setDegreePlan] = useState(null)
  const [course, setCourse] = useState(null)

  return (
    <Router>
      <div className="flex gap-x-4 text-xl">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/onboarding">On-boarding</Link>
        <Link to="/reviews">Reviews</Link>
        <Link to="/degree">Degree</Link>
        <Link to="/course">Course</Link>
        <Link to="/saved-degree">Saved Degree Plans</Link> {/* Update the link */}
      </div>

      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home user={user} setUser={setUser} course={course} setCourse={setCourse}/>} />

        {/* Route for the login page */}
        <Route path="/login" element={<Auth user={user} setUser={setUser} />} />
        
        {/* Route for the onboarding page */}
        <Route path="/onboarding" element={<Onboarding user={user} setUser={setUser} />} />

        {/* Route for the review page */}
        <Route path="/reviews" element={<ReviewPage user={user} setUser={setUser} course={course}/>} />

        <Route path="/degree" element={<DegreePlanner user={user} setUser={setUser} degreePlan={degreePlan}/>} />
        <Route path="/course" element={<CourseInfo user={user} setUser={setUser} course={course}/>} />
        
        {/* Route for the Saved Degree Plans page */}
        <Route path="/saved-degree" element={<SavedDegree degreePlan={degreePlan} setDegreePlan={setDegreePlan} user={user}/>} /> {/* Update route */}
      </Routes>
    </Router>
  );
}

export default App;
