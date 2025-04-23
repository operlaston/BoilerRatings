import {
  ExternalLink,
  ThumbsUp,
  Brain,
  Clock,
  BookOpen,
  MessageCircle,
  Star,
  Flag
} from "lucide-react";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { favoriteCourse } from "../services/course.service";
import { isCourseFavorited } from "../services/user.service";
import InstructorCoursePanel from "../components/InstructorCoursePanel";

const COURSE_DATA = {
  number: "CS 180",
  name: "Programming I",
  description:
    "Problem solving and algorithms, implementation of algorithms in a high level programming language, conditionals, the iterative approach and debugging, collections of data, searching and sorting, solving problems by decomposition, the object-oriented approach, subclasses of existing classes, handling exceptions that occur when the program is running, graphical user interfaces (GUIs), data stored in files, abstract data types, a glimpse at topics from other CS courses. Intended primarily for students majoring in computer sciences. Credit cannot be obtained for both CS 18000 and any of 15600, 15800 and 15900. Not open to students with credit in CS 24000.",
  prerequisites: "MA 161 or MA 165 or MA 167",
  credits: 4,
  ratings: {
    difficulty: 3.8,
    enjoyability: 4.2,
  },
};

function CoursePanel({ course, user, setIsPopupVisible, refreshCourses }) {
  const [courseData, setCourseData] = useState(COURSE_DATA);
  const [favorited, setFavorited] = useState(false);
  const [canFavorite, setCanFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      setFavorited(await isCourseFavorited(user.id, course.id));
    }
    setCourseData(course);
    if (user) {
      setCanFavorite(true);
      fetchFavorite();
    }
  }, []);

  const handleReportClick = () => {
    setIsPopupVisible(true);
    return;
  }

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Course Information */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {courseData.number}
            </h1>
            <h2 className="text-2xl text-gray-700 dark:text-gray-300">
              {courseData.name}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => {
                const query = courseData.number.replace(/\s/g, '').toLowerCase().slice(0, -2);
                
                const url = `https://www.purdue.edu/registrar/search.html?q=${query}`
                window.open(url, '_blank')
              }} 
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <BookOpen className="w-4 h-4 mr-2" />
              Course Catalog
            </button>
            <button
              onClick={() => {
                const baseUrl = 'https://www.reddit.com/r/Purdue/search/?q='
                const processed = courseData.number.replace(/\s/g, ''); 
                const match = processed.match(/^([A-Za-z]+)(\d+)$/); 
                let query;
                
                if (match) {
                  const letters = match[1];
                  const numbers = match[2];
                  const concatenated = letters + numbers; // e.g., CS180
                  const spaced = `${letters} ${numbers}`; // e.g., CS 180
                  query = `${concatenated} OR "${spaced}"`;
                } else {
                  query = processed;
                }
                const encodedQuery = encodeURIComponent(query).replace(/%20/g, '+');
                const url = baseUrl + encodedQuery;
                window.open(url, '_blank')
              }}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Icon icon="mdi:reddit" className="w-4 h-4 mr-2" />
              Reddit
            </button>
            <button
              onClick={handleReportClick}
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Flag className="w-4 h-4 mr-2" />
              Report
            </button>

            {/* Favorite button */}
            {canFavorite === true && (
              <button
                onClick={() => {
                  setFavorited((prev) => !prev);
                  favoriteCourse(course.id, user.id);
                }}
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Star
                  className={`w-6 h-6 mr-2 ${
                    favorited
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  } transition-all duration-300 ease-in-out`}
                />
                {favorited ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {courseData.description}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Prerequisites
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {courseData.prerequisites ? "N/A" : courseData.prerequisites}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">
                  {courseData.creditHours} Credits
                </span>
              </div>
            </div>
            <div>
            <InstructorCoursePanel
              course={course}
              refreshCourses={refreshCourses}
            />
            </div>
          </div>
        </div>
        {/* Right Column - Ratings */}
        <div className="sticky top-10 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Course Ratings
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Difficulty
                </span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {courseData.difficulty}/5.0
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-gray-500 dark:bg-gray-400 rounded-full"
                  style={{
                    width: `${(courseData.difficulty / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Enjoyment
                </span>
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  {courseData.enjoyment}/5.0
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div
                  className="h-full bg-gray-500 dark:bg-gray-400 rounded-full"
                  style={{
                    width: `${(courseData.enjoyment / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          Student Reviews
        </h3>
      </div>
    </>
  );
}
export default CoursePanel;
