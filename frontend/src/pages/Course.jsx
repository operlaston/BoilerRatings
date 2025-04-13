import { useState, useEffect } from "react";
import CoursePanel from "../components/CoursePanel";
import { ArrowLeft } from "lucide-react";
import ReviewPage from "./ReviewPage";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseByName } from "../services/course.service";
import ReportForm from "../components/ReportForm";
import toast, { Toaster } from 'react-hot-toast';
import { sendReport } from "../services/pagereport.service";


function CourseInfo({ user, setUser, setCourse, refreshCourses, setCourses }) {
  const navigate = useNavigate();
  const { course } = useParams();
  const [pageCourse, setPageCourse] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

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

  const handleReportFormSubmit = ( reportContent ) => {
    //TODO: Implement submitting report content
    sendReport(pageCourse.number, reportContent)
    setIsPopupVisible(false);
    toast.success('Thanks for your feedback!')
  }

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  //console.log(pageCourse)
  return (
    <div className="w-full h-min-screen flex items-center justify-center p-4 dark:bg-gray-900 overflow-y-auto">
      <div className="relative flex flex-col w-full max-w-7xl min-h-screen py-12">
        <button className="absolute text-white -left-15 top-20 rounded-full cursor-pointer items-center ">
          <ArrowLeft
            className="text-white h-10 w-10 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </button>
        <div className="relative w-full p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-lg">
          <CoursePanel 
            course={pageCourse} 
            user={user} 
            setIsPopupVisible={setIsPopupVisible}
          />
          <ReviewPage
            course={pageCourse}
            user={user}
            setUser={setUser}
            setCourse={setCourse}
            setCourses={setCourses}
            refreshCourses={refreshCourses}
          />
        </div>
        {isPopupVisible && (
          
          <ReportForm 
            handleReportFormSubmit={handleReportFormSubmit}
            closePopup={closePopup}
          />
        )}
      </div>
      <Toaster
        toastOptions={{
          className: '',
          style: {
            padding: '16px',
            color: '#fefefe',
            backgroundColor: '#1f2937'
          },
        }}
      />
    </div>
  );
}

export default CourseInfo;
/**/