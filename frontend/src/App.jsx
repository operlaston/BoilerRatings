import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ReviewPage from "./pages/ReviewPage";
import DegreePlanner from "./pages/DegreePlanner";
import CourseInfo from "./pages/Course";
import SavedDegree from "./pages/SavedDegree";
import User from "./pages/User"
import { getMajors } from "./services/major.service";
import { getCourses } from "./services/course.service";

function App() {
  // const [user, setUser] = useState('test')
  const [user, setUser] = useState(null);
  const [degreePlan, setDegreePlan] = useState(null);
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState(null);
  const [majors, setMajors] = useState([]);

  const refreshCourses = async () => {
    console.log("refresh courses called in app");
    getCourses()
      .then((listOfCourses) => {
        setCourses(listOfCourses);
      })
      .catch((err) => console.log("Could not retrieve list of courses", err));
  };

  useEffect(() => {
    getCourses()
      .then((listOfCourses) => {
        setCourses(listOfCourses);
      })
      .catch((err) => console.log("Could not retrieve list of courses", err));

    getMajors()
      .then((listOfMajors) => {
        setMajors(listOfMajors);
      })
      .catch((err) => console.log("Could not retrieve list of majors", err));
  }, []);

  return (
    <Router>
      <div className="flex gap-x-4 text-xl">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/degree">Degree</Link>
        <Link to="/saved-degree">Saved Degree Plans</Link>
        {user !== null ? <Link to={`/user/${user.username}`}>User</Link> : ''}
      </div>

      <Routes>
        {/* Route for the home page */}
        <Route
          path="/"
          element={
            <Home
              user={user}
              setUser={setUser}
              course={course}
              setCourse={setCourse}
              courses={courses}
              setCourses={setCourses}
              majors={majors}
              setMajors={setMajors}
            />
          }
        />
        {/* Route for the login page */}
        <Route path="/login" element={<Auth user={user} setUser={setUser} />} />
        {/* Route for the onboarding page */}
        <Route
          path="/onboarding"
          element={<Onboarding user={user} setUser={setUser} />}
        />
        {/* Route for the review page */}
        {/* <Route path="/reviews" element={<ReviewPage user={user} setUser={setUser} course={course}/>} /> */}
        <Route
          path="/degree"
          element={
            <DegreePlanner
              user={user}
              setUser={setUser}
              degreePlan={degreePlan}
            />
          }
        />
        <Route
          path="/course"
          element={
            <CourseInfo
              user={user}
              setUser={setUser}
              course={course}
              setCourse={setCourse}
              setCourses={setCourses}
              refreshCourses={refreshCourses}
            />
          }
        />
        {/* Route for the Saved Degree Plans page */}
        <Route
          path="/saved-degree"
          element={
            <SavedDegree
              degreePlan={degreePlan}
              setDegreePlan={setDegreePlan}
              user={user}
            />
          }
        />{" "}

        <Route path="/user/">
          <Route
            index //username is empty
            element={<User user={"notfound"} setUser={setUser} />}
          />
          <Route
            path=":username" 
            element={<User user={user} setUser={setUser} />}
          />
        </Route>
        {/* Update route */}
      </Routes>
    </Router>
  );
}

export default App;
