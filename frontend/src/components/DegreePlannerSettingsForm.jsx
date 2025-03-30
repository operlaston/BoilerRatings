import React, { useEffect, useState, useRef } from "react";
import { User, ChevronDown, X } from "lucide-react";
import { getMajors } from "../services/major.service";
import { useNavigate } from "react-router-dom";


const GRADUATION_SEMESTERS = [
  "Fall 2023",
  "Spring 2024",
  "Fall 2024",
  "Spring 2025",
  "Fall 2025",
  "Spring 2026",
  "Fall 2026",
  "Spring 2027"
];

// const REQUIREMENTS = [
//   "Calculus I", 
//   "Calculus II", 
//   "Physics I",
//   "Physics II" 
// ]

function DegreePlannersettingsForm({  }) {
  const [allMajors, setAllMajors] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [graduationSemester, setGraduationSemester] = useState("");
  const [isMajorsOpen, setIsMajorsOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const [allRequirements, setAllRequirements] = useState(REQUIREMENTS);
  // const [selectedRequirements, setSelectedRequirements] = useState([]);
  // const [isRequirementsOpen, setIsRequirementsOpen] = useState(false);
  const majorsRef = useRef(null);
  const requirementsRef = useRef(null);
  const navigate = useNavigate();
  const getAllMajors = async () => {
    try {
      const majors = await getMajors()
      setAllMajors(majors)
    } catch {
      console.log("Error getting majors")
    }
  }
  useEffect(() => {
    getAllMajors()
    const handleClickOutside = (event) => {
      if (
        majorsRef.current &&
        !majorsRef.current.contains(event.target)
      ) {
        setIsMajorsOpen(false);
      }
      if (
        requirementsRef.current &&
        !requirementsRef.current.contains(event.target)
      ) {
        setIsRequirementsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {

  };

  const handleMajorToggle = (major) => {
    console.log(allMajors);
    setSelectedMajors((prev) =>
      prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major],
    );
  };
  // const handleRequirementToggle = (requirement) => {
  //   setSelectedRequirements((prev) =>
  //     prev.includes(requirement) ? prev.filter((m) => m !== requirement) : [...prev, requirement],
  //   );
  // };
  return (
    <div className="relative w-lg p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Complete your profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div ref={majorsRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select your major
          </label>
          {(selectedMajors.length != 0) &&
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedMajors.map((major) => (
                <span
                  key={major.name}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
                >
                  {major.name}
                  <button
                    type="button"
                    onClick={() => handleMajorToggle(major)}
                    className="ml-1 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          }
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMajorsOpen(!isMajorsOpen)}
              className="w-full p-2 mt-1 text-left border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center"
            >
              <span className="text-gray-500 dark:text-gray-400">
                {selectedMajors.length
                  ? `${selectedMajors.length} selected`
                  : "Select your major(s)"}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </button>
            {isMajorsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-auto">
                {allMajors.filter(
                  (major) => !selectedMajors.includes(major),
                ).map((major) => (
                  <button
                    key={major.name}
                    type="button"
                    onClick={() => {
                      handleMajorToggle(major);
                      setIsMajorsOpen(false);
                    }
                    }
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {major.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* <div ref={requirementsRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select your completed requirement(s)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedRequirements.map((requirement) => (
              <span
                key={requirement.name}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
              >
                {requirement.name}
                <button
                  type="button"
                  onClick={() => handleRequirementToggle(requirement)}
                  className="ml-1 hover:text-gray-600 dark:hover:text-gray-400 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRequirementsOpen(!isRequirementsOpen)}
              className="w-full p-2 text-left border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center"
            >
              <span className="text-gray-500 dark:text-gray-400">
                {selectedRequirements.length
                  ? `${selectedRequirements.length} selected`
                  : "Select your requirement(s)"}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </button>
            {isRequirementsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-auto">
                {allRequirements.filter(
                  (reqirement) => !selectedRequirements.includes(reqirement),
                ).map((reqirement, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleRequirementToggle(reqirement)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {reqirement}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div> */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Graduation Semester
          </label>
          <div className="relative">
            <select
              value={graduationSemester}
              onChange={(e) => setGraduationSemester(e.target.value)}
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none"
            >
              <option value="">Select semester</option>
              {GRADUATION_SEMESTERS.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 pointer-events-none" />
          </div>
        </div>

        {error && <p className="text-red-500 dark:text-red-300 text-md text-center mt-1 mb-1">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center"
        >
          {isLoading ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}

export default DegreePlannersettingsForm;