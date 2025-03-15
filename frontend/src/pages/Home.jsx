import React, { useEffect, useState } from "react";
import Course from "../components/CourseCard";
import CourseFilterForm from "../components/CourseFilterForm.jsx";
import { getMajors } from '../services/major.service.js'
import { getCourses } from "../services/course.service";

import { useNavigate } from "react-router-dom";

function Home({ course, setCourse, user, setUser, courses, setCourses, majors, setMajors }) {
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [requirements, setRequirements] = useState([]);

  const navigate = useNavigate();

  const onClick = async (course) => {
    setCourse(course);
    navigate("/course");
  };

  const sortCourses = (courses) => {
    if (!sortOption) return courses;

    return [...courses].sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortOption === "numReviews") {
        return order * (a.numReviews - b.numReviews);
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
    filteredCourses = courses.filter((course) =>
      course.requirements.includes(selectedRequirement)
    );
  }

  return (
    <div className="p-20 bg-gray-900 min-h-screen text-white">
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
          className="border-solid border-gray-500 border-b-2 placeholder-white
          w-full px-1 pb-2 focus:outline-none focus:border-white"
          onClick={() => setShowFilters(true)}
        >
          Open Filters
        </button>
        {showFilters && (
          <CourseFilterForm
            onClose={() => setShowFilters(false)}
            onApplyFilters={(filters) => {
              console.log("Applied filters:", filters);
            }}
            onSortChange={(option) => setSortOption(option)}
            selectedMajor={selectedMajor}
            setSelectedMajor={setSelectedMajor}
            selectedRequirement={selectedRequirement}
            setSelectedRequirement={setSelectedRequirement}
            majors={majors}
            setMajors={setMajors}
            requirements={requirements}
            setRequirements={setRequirements}
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
            ).map((course) => (
              <Course
                key={course.id}
                number={course.number}
                name={course.name}
                credits={course.creditHours}
                enjoyment={course.enjoyment}
                difficulty={course.difficulty}
                recommended={course.recommended}
                numReviews={course.numReviews}
                requirements={course.requirements}
                onClick={() => onClick(course)}
              />
            ))}
      </div>
    </div>
  );
}

export default Home;
