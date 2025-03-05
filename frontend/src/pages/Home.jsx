import React, { useEffect, useState } from "react";
import Course from "../components/CourseCard";
import { getCourses } from "../services/courses";
import CourseFilterForm from "../components/CourseFilterForm.jsx";

const placeholderRequirements = ["CS SWE Track", "CS Elective"];

function Home() {
  const [courses, setCourses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const retrieveCourses = async () => {
      try {
        const listOfCourses = await getCourses();
        setCourses(listOfCourses);
      } catch (e) {
        console.log("Could not retrieve list of courses", e);
      }
    };
    // retrieveCourses()
  }, []);

  return (
    <div className="p-20 bg-gray-900 min-h-screen text-white">
      <div className="pb-8 text-xl">
        <input
          type="text"
          placeholder="Search for a course"
          className="border-solid border-gray-500 border-b-2 placeholder-white
          w-full px-1 pb-2 focus:outline-none focus:border-white"
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
        <Course
          number="CS 307"
          name="Software Engineering"
          credits={3}
          enjoyment={4.67}
          difficulty={4.12}
          recommended={0.87}
          numReviews={17}
          requirements={placeholderRequirements}
        />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
        <DeleteThisComponentLater />
      </div>
    </div>
  );
}

const DeleteThisComponentLater = () => {
  return (
    <Course
      number="CS 307"
      name="Software Engineering"
      credits={3}
      enjoyment={4.67}
      difficulty={4.12}
      recommended={0.87}
      numReviews={17}
      requirements={placeholderRequirements}
    />
  );
};

export default Home;
