import { useState } from "react";

const AddCourseForm = ({
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitButtonText = "Add Course",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    description: "",
    creditHours: "",
    prerequisites: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert prerequisites input to [[String]]
    const processedPrerequisites = formData.prerequisites
      .split(';')
      .map(group => 
        group.split(',')
          .map(item => item.trim())
          .filter(item => item)
      )
      .filter(group => group.length > 0);

    await onSubmit({
      ...formData,
      creditHours: Number(formData.creditHours),
      prerequisites: processedPrerequisites
    });

    // Reset form
    setFormData({
      name: "",
      number: "",
      description: "",
      creditHours: "",
      prerequisites: "",
    });
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm mt-4">
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
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, creditHours: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              Format: "MATH 101,CS 102; ENGL 201" → [[MATH 101, CS 102], [ENGL 201]]
            </span>
          </label>
          <input
            type="text"
            value={formData.prerequisites}
            onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter prerequisites separated by commas, groups separated by semicolons"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.number || 
                     !formData.description || !formData.creditHours}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                    p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors 
                    disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center gap-2"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;