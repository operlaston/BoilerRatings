import { useState, useEffect } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";

const EditAccountForm = ({ user, handleSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    majors: [""],
    minors: [""],
    graduationSemester: ""
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        majors: user.major?.length > 0 ? user.major : [""],
        minors: user.minor?.length > 0 ? user.minor : [""],
        graduationSemester: user.graduationSemester || ""
      });
      console.log("Before editing: ", user);
    }
  }, [user]);

  const handleArrayChange = (arrayName, index, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const addField = (arrayName) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], ""] }));
  };

  const removeLastField = (arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName].slice(0, -1) }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Filter out empty fields and prepare submit data
    const submitData = {
      ...formData,
      majors: formData.majors.filter(m => m.trim() !== ""),
      minors: formData.minors.filter(m => m.trim() !== "")
    };
    handleSubmit(submitData);
  };

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
      <form onSubmit={handleFormSubmit} className="space-y-6 max-w-96">
        {/* Username Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="w-96 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Majors Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Majors
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => removeLastField('majors')}
                className="text-red-500 hover:text-red-600"
              >
                <CircleMinus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => addField('majors')}
                className="text-green-500 hover:text-green-600"
              >
                <CirclePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {formData.majors.map((major, index) => (
            <input
              key={index}
              type="text"
              value={major}
              onChange={(e) => handleArrayChange('majors', index, e.target.value)}
              className="w-96 w-96 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          ))}
        </div>

        {/* Minors Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Minors
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => removeLastField('minors')}
                className="text-red-500 hover:text-red-600"
              >
                <CircleMinus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => addField('minors')}
                className="text-green-500 hover:text-green-600"
              >
                <CirclePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {formData.minors.map((minor, index) => (
            <input
              key={index}
              type="text"
              value={minor}
              onChange={(e) => handleArrayChange('minors', index, e.target.value)}
              className="w-96 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          ))}
        </div>

        {/* Graduation Semester */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Graduation Semester
          </label>
          <input
            type="text"
            value={formData.graduationSemester}
            onChange={(e) => setFormData(prev => ({ ...prev, graduationSemester: e.target.value }))}
            className="w-96 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="w-48 p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-48 bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                    p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors 
                    disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center gap-2"
          >
            Confirm Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccountForm;