import { useState } from "react";

const SaveDegreeForm = ({ handleSaveDegreePlan }) => {
  const [degreePlanName, setDegreePlanName] = useState(""); // Degree plan name state

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-white">
        Save your work
      </h1>
      <input
        type="text"
        placeholder="Enter degree plan name..."
        value={degreePlanName}
        onChange={(e) => setDegreePlanName(e.target.value)}
        className="mt-6 w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <button
        onClick={() => handleSaveDegreePlan(degreePlanName)}
        className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-lg focus:ring-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100"
      >
        Save Degree Plan
      </button>
    </div>
  );
}

export default SaveDegreeForm;