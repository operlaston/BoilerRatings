import { getCourseByName } from "../services/course.service"

const CourseCard = ({name, number, credits, enjoyment, difficulty, recommended, numReviews}) => {
    return (
      <div className="bg-gray-800 text-white py-4 px-5 rounded-lg cursor-pointer
        hover:scale-102 transition-all h-full flex flex-col
      "
      >
        <div
          className="text-2xl font-bold pb-1 flex flex-col items-center"
        >
          {number}
        </div>
        <div
          className="text-2xl font-bold pb-1 flex flex-col items-center"
        >
          {name}
        </div>
        <div className="flex flex-col items-center">
          <div className = "text-gray-700 dark:text-gray-300">Credits: {credits}</div>
          <div className = "text-gray-700 dark:text-gray-300">Enjoyment: {enjoyment}</div>
          <div className = "text-gray-700 dark:text-gray-300">Difficulty: {difficulty}</div>
          <div className = "text-gray-700 dark:text-gray-300">Recommended: {recommended*100}%</div>
          <div className = "text-gray-700 dark:text-gray-300">Number of Reviews: {numReviews}</div>
        </div>
      </div>
    )
  }
  
  export default CourseCard;