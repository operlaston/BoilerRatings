import { useState } from "react"
import { updatePrerequisites } from "../services/course.service"

const PrerequisiteForm = ({courses, setCourses}) => {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [newCourses, setNewCourses] = useState([])
  const [error, setError] = useState("")

  const handleDeletePrerequisite = async (index) => {
    // delete the prerequisite
    try {
      const newPrerequisites = [...selectedCourse.prerequisites.slice(0, index), ...selectedCourse.prerequisites.slice(index + 1)]
      setSelectedCourse({...selectedCourse, prerequisites: newPrerequisites})
      setCourses(courses.map(c => c.id === selectedCourse.id ? {...c, prerequisites: newPrerequisites} : c))
      await updatePrerequisites(selectedCourse.id, newPrerequisites)
    }
    catch(e) {
      console.error("failed to remove prerequisite", e)
    }
  }

  const handleAddPrerequisite = async (e) => {
    e.preventDefault()
    // make sure all new courses exist
    const courseSet = new Set(courses.map(course => course.number));
    for (const c of newCourses) {
      if (!courseSet.has(c)) {
        setError("At least one course entered doesn't exist")
        return;
      }
    }

    // add the prerequisite
    try {
      setSelectedCourse({...selectedCourse, prerequisites: [...selectedCourse.prerequisites, newCourses]})
      setCourses(courses.map(c => c.id === selectedCourse.id ? {...c, prerequisites: [...c.prerequisites, newCourses]} : c))
      setNewCourses([])
      await updatePrerequisites(selectedCourse.id, [...selectedCourse.prerequisites, newCourses])
    }
    catch(e) {
      console.error("failed while trying to add prereq", e)
    }
  }

  return (
    <div className="bg-gray-900 min-h-[calc(100vh-3rem)] text-white p-4 flex justify-between gap-6">
      {
        selectedCourse 
        ?
        <CourseForm 
          course={selectedCourse} 
          handleDeletePrerequisite={handleDeletePrerequisite}
          newCourses={newCourses}
          setNewCourses={setNewCourses}
          handleSubmit={handleAddPrerequisite}
          error={error}
          setError={setError}
        />
        :
        <div className="text-2xl font-bold grid place-items-center w-full">
          <div>Select a course to view/change its prerequisites</div>
        </div>
      }
      <CourseSearch courses={courses} setSelectedCourse={setSelectedCourse} />
    </div>
  )
}

const CourseForm = ({course, handleDeletePrerequisite, newCourses, setNewCourses, handleSubmit, error, setError}) => {

  const handleDeleteConfirm = async (index) => {
    if (confirm('Are you sure you want to delete this prerequisite?')) {
      await handleDeletePrerequisite(index)
    }
  }

  return (
    <div className="flex flex-col gap-4 pl-4">
      <div>
        <h1 className="text-4xl font-bold">{course.number}</h1>
        <h3 className="text-lg text-gray-400">{course.name}</h3>
      </div>
      <div className="flex gap-6 items-start">
        <div className="flex flex-col gap-1 max-h bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 overflow-y-auto">
          <div className="text-2xl pb-2">Current Prerequisites</div>
          <div className="flex flex-col gap-1">
            {
              course.prerequisites.length === 0
              ?
              'No prerequisites exist for this course'
              :
              course.prerequisites.map((pArray, index) =>
                <div className="border border-gray-500 rounded-lg p-2 flex flex-col">
                  <div className="text-lg pr-4">Must take one of the following:</div>
                  <div className="pb-2">
                    {pArray.map((p) =>
                      <div className="text-md">
                        {p}
                      </div>
                    )}
                  </div>
                  <button
                    className="py-2 bg-red-800 rounded-lg cursor-pointer"
                    onClick={async () => await handleDeleteConfirm(index)}
                  >
                    Delete Prerequisite
                  </button>
                </div>
              )
            }
          </div>
        </div>
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col gap-1 max-h bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 overflow-y-auto"
        >
          <div className="text-2xl">
            Add a Prerequisite
          </div>
          {
            newCourses.map((newCourse, index) =>
              <div>
                <input 
                  type="text"
                  value={newCourse}
                  onChange={(e) => {setNewCourses(newCourses.map((c, i) => i === index ? e.target.value : c)); setError("")}}
                  className="w-full border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1"
                  placeholder="Course Number (e.g. CS 18000)" 
                />
              </div>
            )
          }
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              className="cursor-pointer bg-green-600 text-white rounded-lg p-2 text-sm"
              onClick={() => setNewCourses([...newCourses, ""])}
            >
              New Course
            </button>
            <button
              type="button"
              className="cursor-pointer bg-red-800 text-white rounded-lg p-2"
              onClick={() => setNewCourses(newCourses.slice(0, -1))}
            >
              Remove Course
            </button>
          </div>
          {
            error !== "" 
            ?
            <div className="text-red-800">
              {error}
            </div>
            :
            ''
          }
          <button
            className="cursor-pointer bg-white text-gray-900 rounded-lg p-2 mt-2"
            type="submit"
          >
            Add Prerequisite
          </button>
          <div>* Note: each course within one prerequisite has an OR relationship</div>
        </form>
      </div>
    </div>
  )
}

const CourseSearch = ({setSelectedCourse, courses}) => {
  const [searchQuery, setSearchQuery] = useState("")

  let filteredCourses = courses
  if (searchQuery !== "") {
    filteredCourses = courses.filter(course => {
      const number = course.number.replaceAll(" ", "").toLowerCase()
      const name = course.name.replaceAll(" ", "").toLowerCase()
      const modifiedSearch = searchQuery.replaceAll(" ", "").toLowerCase()
      return number.includes(modifiedSearch) || name.includes(modifiedSearch)
    })
  }

  return (
    <div className="flex flex-col max-w-[23.1rem] min-w-[23.1rem] flex-shrink-0 gap-1 h-[calc(100vh-5rem)] bg-white dark:bg-gray-800 
    rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto">
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 mb-2
          dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      {filteredCourses.slice(0,100).map(c => 
        <div 
          className="bg-gray-800 max-w-[22rem] min-w-[22rem] px-2 py-1 rounded-md border-gray-600 border cursor-pointer"
          onClick={() => setSelectedCourse(c)}
        >
          <div className="font-semibold">{c.number}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">{c.name}</div>
        </div>
      )}
    </div>
  )
}

export default PrerequisiteForm