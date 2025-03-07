import { useState, useEffect } from "react";

const CourseFilterForm = ({ onClose, onApplyFilters, selectedMajor, setSelectedMajor,
    selectedRequirement, setSelectedRequirement, majors, setMajors, requirements, setRequirements }) => {
  // Mock data

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters({
      major: selectedMajor,
      requirement: selectedRequirement,
    });
    onClose();
  };

  const handleMajorSelect = (e) => {
    if (e.target.value === "") {
      setSelectedMajor("")
      setSelectedRequirement("")
      return
    }
    setSelectedMajor(e.target.value)
    setRequirements(majors.find(major => major.name === e.target.value).requirements)
  }

  return (
    <div className="flex items-center justify-center p-4 z-50 w-full">
      <div className="w-full max-w-3/4 p-6 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
        <div className="text-l font-semibold mb-4 text-gray-900 dark:text-white">
          Filter By Major Requirement
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-row">
            {/* Major Selection */}

            <select
              value={selectedMajor}
              onChange={handleMajorSelect}
              className="w-full p-2 m-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
              required
            >
              <option value="">Choose a major</option>
              {
                majors.map((major, index) => (
                  <option key={major.id} value={major.name}>
                    {major.name}
                  </option>
                ))
              }
            </select>

            {/* Requirement Selection */}
            <select
              value={selectedRequirement}
              onChange={(e) => setSelectedRequirement(e.target.value)}
              className="w-full p-2 m-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
              required
              disabled={!selectedMajor}
            >
              <option value="">Choose a requirement</option>
              {requirements.map((requirement, index) => (
                <option key={index} value={requirement}>
                  {requirement}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/6 p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-1/6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                       p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFilterForm;
