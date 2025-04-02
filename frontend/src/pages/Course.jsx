import { useState, useEffect } from "react";
import CoursePanel from "../components/CoursePanel";
import { ArrowLeft } from "lucide-react";
import ReviewPage from "./ReviewPage";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseByName } from "../services/course.service";

function CourseInfo({ user, setUser, setCourse, refreshCourses, setCourses }) {
  const navigate = useNavigate();
  const {course} = useParams();
  const [pageCourse, setPageCourse] = useState(null);
  useEffect(() => {
    if (course) {
      getCourseByName(course)
        .then(data => {
          setPageCourse(data);
        })
        .catch(error => {
          console.error("Failed to fetch course:", error);
        });
    }
  }, [course]);
  if (!pageCourse) {
    return <div>Loading</div>
  }
  //console.log(pageCourse)
  return (
    <div className="w-full h-min-screen flex items-center justify-center p-4 dark:bg-gray-900 overflow-y-auto">
      <div className="absolute top-2/3 w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-1 ease-in-out duration-150  translate-x-2/3 -translate-y-1/4"></div>
      <div className="absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2 ease-in-out duration-300 translate-x-full -translate-y-1/3"></div>
      <div className="absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3 ease-in-out duration-200 -translate-x-2/3"></div>
      <div className="relative flex flex-col w-full max-w-7xl min-h-screen py-12">
        <button className="absolute text-white -left-15 top-20 rounded-full cursor-pointer items-center ">
          <ArrowLeft
            className="text-white h-10 w-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </button>
        <CoursePanel course={pageCourse} user={user}/>
        <ReviewPage
          course={pageCourse}
          user={user}
          setUser={setUser}
          setCourse={setCourse}
          setCourses={setCourses}
          refreshCourses={refreshCourses}
        />
      </div>
    </div>
  );
}

export default CourseInfo;
/**/