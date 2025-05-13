import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import CourseFilterForm from "../components/CourseFilterForm.jsx";
import { getMajors } from '../services/major.service.js'
import { getCourses } from "../services/course.service";

import { useNavigate, useLocation } from "react-router-dom";

function Home({ course, setCourse, courses, setCourses, majors, setMajors, user }) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [showFavorited, setShowFavorited] = useState(false);
  const [showInactiveWarning, setShowInactiveWarning] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    console.log("Current state:", location.state?.warning);

    if (location.state?.warning) {
      setShowInactiveWarning(true);
      navigate(".", { 
        replace: true, 
        state: {} 
      });    }
  }, [location.state, navigate]);

  const onClick = async (course) => {
    setCourse(course);
    let num = course.number;
    num = num.toLowerCase().replace(/\s+/g, '');
    navigate(`/course/${num}`);
  };

  const sortCourses = (courses) => {
    if (!sortOption) return courses;

    return [...courses].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortOption === "numReviews") {
        return order * (a.reviews.length - b.reviews.length);
      } else if (sortOption === "difficulty") {
        return order * (a.difficulty - b.difficulty);
      } else if (sortOption === "enjoyment") {
        return order * (a.enjoyment - b.enjoyment);
      }
      return 0;
    });
  };

  let filteredCourses = courses;
  if (courses !== null && selectedRequirement !== "") {
    // filteredCourses = courses.filter((course) =>
    //   course.requirements.includes(selectedRequirement)
    // );
    const selectedRequirementObject = requirements.find(requirement => requirement.name === selectedRequirement)
    filteredCourses = courses.filter(course => {
      let found = false;
      for (const subrequirement of selectedRequirementObject.subrequirements) {
        // console.log('reqCourse', subrequirement.courses)
        for (const reqCourse of subrequirement.courses) {
          // if course is in courses, keep it
          if (course.number === reqCourse) {
            found = true;
            break;
          }
        }
        if (found) break;
      }
      return found;
    })
  }
  if (showFavorited) {
    filteredCourses = filteredCourses.filter(course => user.favorited.find(courseId => course.id == courseId))
  }

  return (
    <div className="p-20 bg-gray-900 min-h-screen text-white">
      {/* Popup for inactive accounts */}
      {showInactiveWarning && (
        <div className="inactive-warning-popup">
          <h2>Your Account Is Inactive</h2>
          <p>Your last login was over a year ago. Consider deleting your account.</p>
          <button onClick={() => setShowInactiveWarning(false)}>Close</button>
        </div>
      )}

{showInactiveWarning && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-red-400">
        ⚠️ Inactive Account Detected
      </h2>
      <p className="mb-6 text-gray-300">
        Your last login was over a year ago. For security purposes, we recommend 
        deleting your account if you're no longer using our services.
      </p>
      
      <div className="flex gap-4 justify-end">
        <button
          onClick={() => setShowInactiveWarning(false)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={() => setShowInactiveWarning(false)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
)}





      <div className="pb-8 text-xl">
        <input
          type="text"
          placeholder="Search for a course"
          className="border-solid border-gray-500 border-b-2 placeholder-white
          w-full px-1 pb-2 focus:outline-none focus:border-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={`border-solid border-gray-500 border-b-2 placeholder-white
          w-full px-1 pb-2 focus:outline-none cursor-pointer ${showFilters ? 'border-white' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          Open Filters
        </button>
        {showFilters && (
          <CourseFilterForm
            onClose={() => setShowFilters(false)}
            onSortChange={(option) => setSortOption(option)}
            selectedMajor={selectedMajor}
            setSelectedMajor={setSelectedMajor}
            selectedRequirement={selectedRequirement}
            setSelectedRequirement={setSelectedRequirement}
            majors={majors}
            setMajors={setMajors}
            requirements={requirements}
            setRequirements={setRequirements}
            user={user}
            setShowFavorited={setShowFavorited}
            showFavorited={showFavorited}
          />
        )}
      </div>

      <div className="pb-4 flex gap-4">
        <div>
          <label className="mr-2">Sort by:</label>
          <select
            className="bg-gray-800 text-white p-2 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">None</option>
            <option value="numReviews">Number of Reviews</option>
            <option value="difficulty">Difficulty</option>
            <option value="enjoyment">Enjoyability</option>
          </select>
        </div>

        <div>
          <label className="mr-2">Order:</label>
          <select
            className="bg-gray-800 text-white p-2 rounded"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredCourses === null
          ? ""
          : sortCourses(
              filteredCourses.filter((course) => {
                const searchToMatch = search.toLowerCase().replace(/\s+/g, "");
                return (
                  course.name.toLowerCase().replace(/\s+/g, "").includes(searchToMatch) ||
                  course.number.toLowerCase().replace(/\s+/g, "").includes(searchToMatch) ||
                  course.description.toLowerCase().replace(/\s+/g, "").includes(searchToMatch)
                );
              })
            ).slice(0,90).map((course) => (
              <CourseCard
                key={course.id}
                number={course.number}
                name={course.name}
                credits={course.creditHours}
                enjoyment={course.enjoyment}
                difficulty={course.difficulty}
                recommended={course.recommended}
                numReviews={course.reviews.length}
                reviews={course.reviews}
                // requirements={course.requirements}
                onClick={() => onClick(course)}
              />
            ))}
      </div>
    </div>
  );
}

export default Home;
