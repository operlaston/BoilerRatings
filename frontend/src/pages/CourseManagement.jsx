import { useState } from "react";
import AddCourseForm from "../components/AddCourseForm";

const CourseManagement = () => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (courseData) => {
    console.log("Submitted course data:", courseData);
    //Implement actual stuff here
    console.log(`Would normally submit: ${JSON.stringify(courseData, null, 2)}`);
    setShowForm(false);
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    setShowForm(false);
  };

  return (
    <div class="p-20 bg-gray-900 min-h-screen text-white">
      <div className="p-4 max-w-2xl mx-auto bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
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
    </div>
  );
};

export default CourseManagement;
