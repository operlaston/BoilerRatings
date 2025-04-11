import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import ReviewPage from "./pages/ReviewPage";
import CourseCompare from "./pages/CourseCompare";
import DegreePlanner from "./pages/DegreePlanner";
import CourseInfo from "./pages/Course";
import SavedDegree from "./pages/SavedDegree";
import User from "./pages/User"
import { LoadingPage } from "./components/Loading";
import { getMajors } from "./services/major.service";
import { getCourses } from "./services/course.service";
import { getRequirements } from "./services/requirement.service";
import { Navbar } from "./components/navbar";
import { getUserById } from "./services/user.service";

function App() {
  // const [user, setUser] = useState('test')
  const [user, setUser] = useState(null);
  const [degreePlan, setDegreePlan] = useState(null);
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState(null);
  const [majors, setMajors] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCourses = async () => {
    console.log("refresh courses called in app");
    getCourses()
      .then((listOfCourses) => {
        setCourses(listOfCourses);
      })
      .catch((err) => console.log("Could not retrieve list of courses", err));
  };

  useEffect(() => {
    Promise.all([
      getCourses().then(setCourses).catch(err => console.log("Could not retrieve list of courses", err)),
      getMajors().then(setMajors).catch(err => console.log("Could not retrieve list of majors", err)),
      getRequirements().then(setRequirements).catch(err => console.log("Could not retrieve list of requirements", err)),
      getCachedUser().then(retrievedUser => onLogin(retrievedUser)).catch(e => console.error("error occurred while retrieving user", e))
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);
  

  const onLogout = () => {
    // localStorage.setItem('cachedUser', "");
    localStorage.removeItem('cachedUser')
    window.location.reload();
  }

  const onLogin = (u) => {
    if (!u || u.banned) return
    setUser(u);
    console.log("User got", u);
    if (u != getCachedUser()) {
      cacheUserToBrowser(u);
    }
  }

  const cacheUserToBrowser = (user) => {
    localStorage.setItem('cachedUser', user?.id);
  }

  const getCachedUser = async () => {
    const userid = localStorage.getItem('cachedUser');
    if (userid && userid != "undefined") {
      const user = await getUserById(userid)
      if (user.banned) return null
      return user
    }
    return null
  }

  if (isLoading) {
    return (
      <LoadingPage message="Loading app..."/>
    )
  }

  return (
    <Router>
      <Navbar
        user={user}
        onLogout={onLogout}
      />

      <Routes>
        {/* Route for the home page */}
        <Route
          path="/"
          element={
            <Home
              course={course}
              setCourse={setCourse}
              courses={courses}
              setCourses={setCourses}
              majors={majors}
              setMajors={setMajors}
              user={user}
            />
          }
        />
        {/* Route for the login page */}
        <Route path="/login" element={<Auth onLogin={onLogin} />} />
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
          path="/course/:course"
          element={
            <CourseInfo
              user={user}
              setUser={setUser}
              setCourse={setCourse}
              setCourses={setCourses}
              refreshCourses={refreshCourses}
            />
          }
        />
        {/* Route for class comparison page */}
        <Route
          path="/compare"
          element={
            <CourseCompare
              requirements={requirements}
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
