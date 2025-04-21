import { useState } from "react";
import { updateCourse, getCourses } from "../services/course.service";

const EditCourseForm = ({ courses, setCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [creditHours, setCreditHours] = useState(0);
  const [newInstructor, setNewInstructor] = useState("");
  const [instructors, setInstructors] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    setSelectedCourse(courseName);
    
    if (courseName === "") {
      resetForm();
      return;
    }
    
    const course = courses.find(course => course.name === courseName);
    if (course) {
      setCourseName(course.name);
      setCourseDescription(course.description || "");
      setCreditHours(course.creditHours || 0);
      setInstructors(course.instructors || []);
    }
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setCourseName("");
    setCourseDescription("");
    setCreditHours(0);
    setInstructors([]);
    setNewInstructor("");
  };

  const handleAddInstructor = () => {
    if (newInstructor.trim() === "") return;
    if (instructors.includes(newInstructor.trim())) {
      setError("Instructor already exists for this course");
      return;
    }
    setInstructors([...instructors, newInstructor.trim()]);
    setNewInstructor("");
    setError("");
  };

  const handleRemoveInstructor = (instructorToRemove) => {
    setInstructors(instructors.filter(instructor => instructor !== instructorToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedCourse) {
      setError("Please select a course first");
      return;
    }

    if (courseName.trim() === "") {
      setError("Course name cannot be empty");
      return;
    }

    try {
      const courseId = courses.find(course => course.name === selectedCourse).id;
      const updatedCourse = {
        name: courseName,
        description: courseDescription,
        creditHours: Number(creditHours),
        instructors: instructors
      };

      await updateCourse(courseId, updatedCourse);
      setSuccess("Course updated successfully!");
      
      // Refresh course list
      const updatedCourses = await getCourses();
      setCourses(updatedCourses);
    } catch (e) {
      console.error("An error occurred while updating the course", e);
      setError("Failed to update course. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen text-white p-4">
      <div className="text-lg">
        <label htmlFor="courses-dropdown">
          Select a course to edit: &nbsp;
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

      {selectedCourse && (
        <div className="w-full max-w-2xl dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="course-name" className="block text-sm font-medium text-gray-300 mb-1">
                  Course Name
                </label>
                <input
                  id="course-name"
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Course Name"
                />
              </div>

              <div>
                <label htmlFor="course-description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="course-description"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Course Description"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="credit-hours" className="block text-sm font-medium text-gray-300 mb-1">
                  Credit Hours
                </label>
                <input
                  id="credit-hours"
                  type="number"
                  min="0"
                  max="10"
                  value={creditHours}
                  onChange={(e) => setCreditHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Credit Hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Instructors
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add new instructor"
                  />
                  <button
                    type="button"
                    onClick={handleAddInstructor}
                    className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                {instructors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {instructors.map((instructor, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                        <span>{instructor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInstructor(instructor)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <div className="text-red-400">{error}</div>}
            {success && <div className="text-green-400">{success}</div>}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-500 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditCourseForm;