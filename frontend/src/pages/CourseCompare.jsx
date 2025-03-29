import React from "react";
import CoursePanel from "../components/CoursePanel";
import { useNavigate } from "react-router-dom";

function CourseCompare() {
    const [search, setSearch] = useState("");

    const navigate = useNavigate();
    const Course2 = null;

    let Course1 = course;
    if (course !== null) {
      filteredCourses = courses.filter((course) =>
        course.requirements.includes(selectedRequirement)
      );
    }

    return (
    <div className="w-full h-min-screen flex items-center justify-center p-4 dark:bg-gray-900 overflow-y-auto">
        <div className="absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 translate-x-full -translate-y-1/3"></div>
        <div className="absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 translate-x-full -translate-y-1/3"></div>
        <div className="absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3 ease-in-out duration-200 -translate-x-2/3"></div>
        
        <div className="relative flex flex-col w-full max-w-7xl min-h-screen py-12">
            <div>
            <label className="absolute top-1/16 p-1 mr-2 text-white">Sort by:</label>
            <select
                className="bg-gray-800 text-white p-2 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            >
                <option value="">None</option>
                <option value="CS180">CS180</option>
            </select>
            </div>
            <div>
                {Course1 === null
                 ? "" :
                 Course1.filter((course) => {
                    const searchToMatch = search.toLowerCase().replace(/\s+/g, "");
                    return (
                      course.name.toLowerCase().replace(/\s+/g, "").includes(searchToMatch) ||
                      course.number.toLowerCase().replace(/\s+/g, "").includes(searchToMatch) ||
                      course.description.toLowerCase().replace(/\s+/g, "").includes(searchToMatch)
                    );
                  })
                .map((course) = <CourseCompare
                    key={course.id}
                    number={course.number}
                    name={course.name}
                    credits={course.creditHours}
                    enjoyment={course.enjoyment}
                    difficulty={course.difficulty}
                    recommended={course.recommended}
                    numReviews={course.numReviews}
                    requirements={course.requirements}
                />
                )}
            </div>
        </div>
    </div>
    )
}

export default CourseCompare;