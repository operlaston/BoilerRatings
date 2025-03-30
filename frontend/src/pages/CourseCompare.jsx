import React, { useState, useEffect } from "react";
import CoursePanel from "../components/CourseCompareCard";
import { useNavigate } from "react-router-dom";
import { getCoursesFromRequirement } from "../services/requirement.service";
import { getCourseByName } from "../services/course.service";

function CourseCompare({requirements}) {
    const [chosenReq, setChosenReq] = useState("");
    const [courses, setCourses] = useState([]);
    const [option1, setOption1] = useState("");
    const [course1, setCourse1] = useState(null);
    const [option2, setOption2] = useState("");
    const [course2, setCourse2] = useState(null);

    const navigate = useNavigate();

    let reqs = requirements;
    if (reqs !== null) {
      reqs = requirements;
    }


    return (
      <div className="w-full min-h-screen flex flex-col items-center p-4 dark:bg-gray-900 overflow-y-auto relative">
        <div className="absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 translate-x-full -translate-y-1/3"></div>
        <div className="absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 translate-x-full -translate-y-1/3"></div>
        <div className="absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3 ease-in-out duration-200 -translate-x-2/3"></div>
        
        <div className="w-full max-w-7xl flex flex-col z-10">
          <div className="flex flex-col md:flex-row justify-center gap-4 py-6 w-full">
            <div className="flex flex-col items-center w-full md:w-auto">
                <label className="p-1 text-white w-full text-center mb-2">Class 1:</label>
                <select
                    className="bg-gray-800 text-white p-2 rounded"
                    value={option1}
                    onChange={async (e) => {
                      const value = e.target.value;
                      if (value != "") {
                        const obj = await getCourseByName(value);
                        setCourse1(obj);
                        setOption1(value);
                      }
                      else {
                      setCourse1(null);
                      }
                      setOption1(value);
                    }}
                >
                    <option value="">None</option>
                    {
                      courses === null
                      ? "" : 
                      courses.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))
                    }
                </select>
            </div>
            <div className="flex flex-col items-center w-full md:w-auto">
                <label className="p-1 text-white w-full text-center mb-2">Requirement:</label>
                <select
                    className="bg-gray-800 text-white p-2 rounded"
                    value={chosenReq}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setChosenReq(value);
                      if (value !== "") {
                        const newCourses = await getCoursesFromRequirement(value);
                        setCourses(newCourses);
                        console.log("newCourses: " + newCourses);
                      }
                      else {
                        setCourses([]);
                        setOption1("");
                        setCourse1(null);
                        setOption2("");
                        setCourse2(null);
                      }
                    }}
                >
                    <option value="">None</option>
                    {
                      reqs === null
                      ? "" :
                      reqs.map((requirement) => (
                        <option key={requirement.name} value={requirement.name}>{requirement.name}</option>
                      ))
                    }
                </select>
            </div>
            <div className="flex flex-col items-center w-full md:w-auto">
                <label className="p-1 text-white w-full text-center mb-2">Class 2:</label>
                <select
                    className="bg-gray-800 text-white p-2 rounded"
                    value={option2}
                    onChange={async (e) => {
                      const value = e.target.value;
                      if (value != "") {
                        const obj = await getCourseByName(value);
                        setCourse2(obj);
                        setOption2(value);
                      }
                      else {
                      setCourse2(null);
                      }
                      setOption2(value);
                    }}
                >
                    <option value="">None</option>
                    {
                      courses === null
                      ? "" : 
                      courses.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))
                    }
                </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full mt-4">
              <div className="flex-1">
                {course1 ?
                    <CoursePanel
                      key={course1.id}
                      number={course1.number}
                      name={course1.name}
                      credits={course1.creditHours}
                      enjoyment={course1.enjoyment}
                      difficulty={course1.difficulty}
                      recommended={course1.recommended}
                      numReviews={course1.numReviews}
                      requirements={course1.prerequisites}
                    />
                    : ""
                  }
              </div>
              <div className="flex-1">
                {course2 ? 
                    <CoursePanel
                      key={course2.id}
                      number={course2.number}
                      name={course2.name}
                      credits={course2.creditHours}
                      enjoyment={course2.enjoyment}
                      difficulty={course2.difficulty}
                      recommended={course2.recommended}
                      numReviews={course2.numReviews}
                      requirements={course2.prerequisites}
                    />
                    : ""
                }
            </div>
          </div>
        </div>
    </div>
    )
}

export default CourseCompare;