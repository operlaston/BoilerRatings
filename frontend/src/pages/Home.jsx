import React, { useEffect, useState } from "react";
import Course from "../components/CourseCard";
import { getCourses } from "../services/courses";
import CourseFilterForm from "../components/CourseFilterForm.jsx";

const placeholderRequirements = ["CS SWE Track", "CS Elective"];

function Home() {
  const [courses, setCourses] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('')

  useEffect(() => {
    const retrieveCourses = async () => {
      try {
        const listOfCourses = await getCourses();
        setCourses(listOfCourses);
      } catch (e) {
        console.log("Could not retrieve list of courses", e);
      }
    };
    retrieveCourses()
  }, []);

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
              // filter logic goes here
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {
          courses === null ? "" : 
            courses
              .filter(course => {
                // checks search match by removing all spaces and ignoring case
                const searchToMatch = search.toLowerCase().replace(/\s+/g, '')
                return (course.name.toLowerCase().replace(/\s+/g, '').includes(searchToMatch) ||
                course.number.toLowerCase().replace(/\s+/g, '').includes(searchToMatch)) ||
                course.description.toLowerCase().replace(/\s+/g, '').includes(searchToMatch)
              })
              .map(course =>
                <Course
                  number={course.number}
                  name={course.name}
                  credits={course.creditHours}
                  enjoyment={course.enjoyment}
                  difficulty={course.difficulty}
                  recommended={course.recommended}
                  numReviews={course.numReviews}
                  requirements={course.requirements}
                />
              )
        }
      </div>
    </div>
  );
}

export default Home;
