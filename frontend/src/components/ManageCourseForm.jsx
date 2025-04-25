import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import {
  deleteCourse,
  getCourses,
  createCourse,
  updateCourse,
} from "../services/course.service";

const ManageCourseForm = ({
  submitButtonText = "Add Course",
  courses,
  setCourses,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
    creditHours: "",
    prerequisites: "",
  });

  const [courseToDelete, setCourseToDelete] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // temp delete handler
  const handleDeleteCourse = async () => {
    try {
      // Find course by name or number
      const course = courses.find(
        (c) => c.name === courseToDelete || c.number === courseToDelete
      );

      if (!course) {
        alert("Course not found");
        return;
      }

      await deleteCourse(course.id);

      // Refresh course list
      const updatedCourses = await getCourses();
      setCourses(updatedCourses);

      setCourseToDelete("");
      setShowDeletePopup(false);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete course");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      name: "",
      number: "",
      description: "",
      creditHours: "",
      prerequisites: "",
    });

    try {
      const processedPrerequisites = formData.prerequisites
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter((item) => item);

      const formattedNumber = formData.number
        .toUpperCase()
        .replace(/([A-Z]+)(\d+)/, "$1 $2")
        .replace(/\s+/g, " ");

      // Validate number format
      if (!/^[A-Z]+\s\d+[A-Z]*$/.test(formattedNumber)) {
        alert('Invalid course number format (e.g. "CS 180")');
        return;
      }

      // Prepare course data
      const courseData = {
        number: formattedNumber,
        name: formData.name.trim(),
        description: formData.description.trim(),
        creditHours: Number(formData.creditHours) || 3,
        prerequisites: processedPrerequisites,
      };

      // Create course
      await createCourse(courseData);

      const updatedCourses = await getCourses();
      setCourses(updatedCourses);
      setFormData({
        name: "",
        number: "",
        description: "",
        creditHours: "",
        prerequisites: "",
      });
    } catch (err) {
      console.error("Error:", err);
      alert(`Error: ${err.response?.data?.error || "Failed to create course"}`);
    }
  };

  return (
    <div className="max-w-1/2  p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Course Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </div>

        {/* Course Number */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Number *
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) =>
              setFormData({ ...formData, number: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </div>

        {/* Credit Hours */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Credit Hours *
          </label>
          <input
            type="number"
            value={formData.creditHours}
            onChange={(e) =>
              setFormData({ ...formData, creditHours: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
            min="1"
            step="1"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white/90 dark:bg-gray-800/80 placeholder-gray-400 dark:placeholder-gray-100 
                focus:outline-none focus:ring-2 focus:ring-orange-500 
                text-gray-900 dark:text-gray-200 resize-none transition-all duration-200"
            rows={3}
            required
          />
        </div>

        {/* Prerequisites */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Prerequisites (Optional)
            <span className="text-xs text-gray-500 ml-2">
              Format: "MATH 101,CS 102; ENGL 201" → [[MATH 101, CS 102], [ENGL
              201]]
            </span>
          </label>
          <input
            type="text"
            value={formData.prerequisites}
            onChange={(e) =>
              setFormData({ ...formData, prerequisites: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter prerequisites separated by commas, groups separated by semicolons"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={
              !formData.name ||
              !formData.number ||
              !formData.description ||
              !formData.creditHours
            }
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 
          p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 
          active:scale-95 active:opacity-80
          transition-all duration-150 ease-in-out
          disabled:bg-gray-300 dark:disabled:bg-gray-600 
          flex items-center justify-center gap-2"
          >
            {submitButtonText}
          </button>
        </div>
      </form>

      {/* Delete Course Section */}
      <div className="mt-6">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={courseToDelete}
            onChange={(e) => setCourseToDelete(e.target.value)}
            placeholder="Enter course name to delete"
            className="flex-1 p-2 border rounded-lg bg-white dark:bg-gray-800 
                     dark:text-gray-200 focus:outline-none focus:ring-2 
                     focus:ring-orange-500"
          />
          <button
            onClick={() => courseToDelete && setShowDeletePopup(true)}
            disabled={!courseToDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg
                     hover:bg-red-700 transition-colors disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            Delete Course
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg border border-red-600 w-full max-w-md">
            <div
              className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowDeletePopup(false)}
            >
              <IoMdClose className="h-6 w-6" />
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-200">
                Confirm deletion of course:
                <span className="text-red-400 ml-2">{courseToDelete}</span>
              </h3>
              <p className="mt-2 text-red-500 text-sm">
                Warning: This action cannot be undone
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourseForm;
