import { useState, useEffect } from "react";
import { CirclePlus, CircleMinus } from "lucide-react";
import { getMajors } from "../services/major.service";

const EditAccountForm = ({ user, handleSubmit, onFinish }) => {
  const [formData, setFormData] = useState({
    username: "",
    major: [],
    minor: [],
    graduationSemester: "",
  });

  const [allMajors, setAllMajors] = useState([]);

  const getAllMajors = async () => {
    try {
      const majors = await getMajors();
      setAllMajors(majors);
    } catch {
      console.log("Error getting majors");
    }
  };

  // Initialize form with user data
  useEffect(() => {
    const initializeForm = async () => {
      await getAllMajors();
      if (user && allMajors.length > 0) {
        const majorPairs = user.major.map(id => {
          const major = allMajors.find(m => m.id === id);
          return major ? [major.name, major.id] : ["", ""];
        });
        
        const minorPairs = user.minor.map(id => {
          const major = allMajors.find(m => m.id === id); // Using majors as placeholder
          return major ? [major.name, major.id] : ["", ""];
        });

        setFormData({
          username: user.username || "",
          major: majorPairs,
          minor: minorPairs,
          graduationSemester: user.graduationSemester || "",
        });
      }
      else {
        setFormData({
          username: user.username || "",
          major: [],
          minor: [],
          graduationSemester: user.graduationSemester || "",
        });
      }
    };
    initializeForm();
  }, [user]);

  const handleArrayChange = (arrayName, index, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = value;
    setFormData(prev => ({ ...prev, [arrayName]: updatedArray }));
  };

  const addField = (arrayName) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], ["", ""]] }));
  };

  const removeLastField = (arrayName) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({ ...prev, [arrayName]: prev[arrayName].slice(0, -1) }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      major: formData.major.map(pair => pair[1]).filter(id => id),
      minor: formData.minor.map(pair => pair[1]).filter(id => id),
    };
    handleSubmit(submitData);
    onFinish()
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
                onClick={() => removeLastField("major")}
                className="text-red-500 hover:text-red-600"
              >
                <CircleMinus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => addField("major")}
                className="text-green-500 hover:text-green-600"
              >
                <CirclePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {console.log("All Majors IDs:", allMajors?.map(m => m.id.toString()))}
          {formData.major.map((pair, index) => (
            <select
              key={index}
              value={pair[1]} // Now using id directly (assuming it's already a string)
              onChange={(e) => {
                const selected = allMajors.find(m => m.id === e.target.value);
                if (selected) {
                  handleArrayChange("major", index, [selected.name, selected.id]);
                  console.log("Selected major:", selected);
                }
              }}
              className="w-96 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Major</option>
              {allMajors.map(major => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))}
            </select>
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
                onClick={() => removeLastField("minor")}
                className="text-red-500 hover:text-red-600"
              >
                <CircleMinus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => addField("minor")}
                className="text-green-500 hover:text-green-600"
              >
                <CirclePlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {formData.minor.map((pair, index) => (
            <select
              key={index}
              value={pair[1]}
              onChange={(e) => {
                const selected = allMajors.find(m => m.id === e.target.value);
                if (selected) handleArrayChange("minor", index, [selected.name, selected.id]);
              }}
              className="w-96 px-3 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Minor</option>
              {allMajors.map(major => (
                <option key={major.id} value={major.id}>{major.name}</option>
              ))}
            </select>
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
            onClick={onFinish}
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