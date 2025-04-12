import { useState } from "react";
import AddCourseForm from "../components/AddCourseForm";
import { IoMdClose } from "react-icons/io";

const CourseManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleSubmit = async (courseData) => {
    console.log("Submitted course data:", courseData);
    alert(`Would normally submit: ${JSON.stringify(courseData, null, 2)}`);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  // temp delete handler
  const handleDeleteCourse = async () => {
    console.log(`Would delete course: ${courseToDelete}`);
    setCourseToDelete("");
    setShowDeletePopup(false);
  };

  return (
    <div class="p-20 bg-gray-900 min-h-screen text-white">
      <div className="p-4 max-w-2xl mx-auto bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        {/* Add Course Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                   px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 
                   transition-colors"
          >
            Add New Course
          </button>

          {showForm && (
            <div className="mt-4">
              <AddCourseForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={false}
              />
            </div>
          )}
        </div>

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
    </div>
  );
};

export default CourseManagement;
