import React, { useEffect, useState } from "react";
import Course from "../components/CourseCard";
import { getCourses } from "../services/courses";
import CourseFilterForm from "../components/CourseFilterForm.jsx";
import { getMajors } from '../services/majors'
import { useNavigate } from "react-router-dom";

const placeholderRequirements = ["CS SWE Track", "CS Elective"];

function Home({course, setCourse}) {
  const [courses, setCourses] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedRequirement, setSelectedRequirement] = useState("");
  const [majors, setMajors] = useState([])
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    const retrieveCourses = async () => {
      try {
        const listOfCourses = await getCourses();
        setCourses(listOfCourses);
      } catch (e) {
        console.log("Could not retrieve list of courses", e);
      }
    };
    const retrieveMajors = async () => {
      try {
        const retrievedMajors = await getMajors()
        setMajors(retrievedMajors)
      }
      catch (err) {
        console.log('an error occurred while trying to retrieve majors')
      }
    }
    
    console.log("here lol")
    retrieveMajors()
    retrieveCourses();
  }, []);
  const navigate = useNavigate();
  const onClick = async (course) => {
    setCourse(course)
    navigate('/course')
  }

  const sortCourses = (courses) => {
    if (!sortOption) return courses;
    
    return [...courses].sort((a, b) => {
      if (sortOption === "mostReviews") {
        return b.numReviews - a.numReviews;
      } else if (sortOption === "highestDifficulty") {
        return b.difficulty - a.difficulty;
      } else if (sortOption === "highestEnjoyability") {
        return b.enjoyment - a.enjoyment;
      }
      return 0;
    });
  };

  let filteredCourses = courses
  if (courses !== null && selectedRequirement !== "") {
    filteredCourses = courses.filter(course => {
      return course.requirements.find(req => req === selectedRequirement)
    })
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

      <div className="pb-4">
        <label className="mr-2">Sort by:</label>
        <select 
          className="bg-gray-800 text-white p-2 rounded"
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">None</option>
          <option value="mostReviews">Most Reviews</option>
          <option value="highestDifficulty">Highest Difficulty</option>
          <option value="highestEnjoyability">Highest Enjoyability</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {
          filteredCourses === null ? "" : 
            sortCourses(
              filteredCourses.filter(course => {
                const searchToMatch = search.toLowerCase().replace(/\s+/g, '')
                return (
                  course.name.toLowerCase().replace(/\s+/g, '').includes(searchToMatch) ||
                  course.number.toLowerCase().replace(/\s+/g, '').includes(searchToMatch) ||
                  course.description.toLowerCase().replace(/\s+/g, '').includes(searchToMatch)
                );
              })
            ).map(course =>
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
            )
        }
      </div>
    </div>
  );
}

export default Home;

