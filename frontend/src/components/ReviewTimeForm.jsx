import { useState } from "react"
import { updateTimeToReview, getCourses } from "../services/course.service"

const ReviewTimeForm = ({courses, setCourses}) => {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [courseTime, setCourseTime] = useState("")
  const [timeString, setTimeString] = useState("")
  const [error, setError] = useState("")
  const [newDate, setNewDate] = useState(Date.now())

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value)
    if (e.target.value === "") {
      setNewDate(Date.now())
      setError("")
      return;
    }
    const timeToReview = courses.find(course => course.name === e.target.value).timeToReview
    setCourseTime(timeToReview)
    setNewDate(timeToReview)
    const year = timeToReview.substring(0,4)
    const month = timeToReview.substring(5,7)
    const day = timeToReview.substring(8,10)
    console.log(month + "/" + day + "/" + year)
    setTimeString(month + "/" + day + "/" + year)
    setError("")
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newDate === null)
        return

    try {
        const id = courses.find(course => course.name === selectedCourse).id
        updateTimeToReview(id, newDate);
        location.reload()
    }
    catch(e) {
      console.error("an error occurred while updating the time", e)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen text-white p-4">
      <div className="text-lg">
        <label htmlFor="courses-dropdown">
          Select a course to change the time of: &nbsp;
        </label>
        <select
          id="courses-dropdown"
          value={selectedCourse}
          onChange={handleCourseChange}
          className="border rounded-md p-1 bg-white dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Choose a Course</option>
          {courses.map(course =>
            <option key={course.id} value={course.name}>{course.name}</option>
          )}
        </select>
      </div>
      {selectedCourse === "" ?
        "" :
        <div className="flex flex-col gap-2">
          <div className="dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all py-3 px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div>
                    <label>Current Time: {timeString}</label>
                </div>
                <div className="text-lg">
                  <input 
                    type="date" 
                    placeholder="mm/dd/yyyy"
                    value={newDate}
                    onChange={(e) => {setNewDate(e.target.value);setError("")}}
                    className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1 w-full"
                  />
                </div>
                <div>
                  <div className="pb-6 flex flex-col gap-2">
                    {

                    }
                  </div>
                </div>
              </div>
              {error !== "" ? <div className="text-red-800">{error}</div> : ''}
              <button className="cursor-pointer bg-white text-gray-900 rounded-lg p-2 font-semibold" type="submit">Update Time</button>
            </form>
          </div>
        </div>
      }
    </div>
  )
}

export default ReviewTimeForm