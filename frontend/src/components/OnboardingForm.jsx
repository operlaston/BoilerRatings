import React, { useEffect, useState, useRef } from "react";
import { User, ChevronDown, X } from "lucide-react";
import { getMajors } from "../services/majors";
import { onboard } from "../services/signup";

const MAJORS = [
  "Computer Science",
  "Data Science", 
  "AI"
];
const GRADUATION_SEMESTERS = [
  "Fall 2023",
  "Spring 2024",
  "Fall 2024",
  "Spring 2025",
  "Fall 2025",
  "Spring 2026",
];
function OnboardingForm({user, setUser}) {
  const [displayName, setDisplayName] = useState("");
  const [allMajors, setAllMajors] = useState(MAJORS);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedMinors, setSelectedMinors] = useState([]);
  const [graduationSemester, setGraduationSemester] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMajorsOpen, setIsMajorsOpen] = useState(false);
  const [isMinorsOpen, setIsMinorsOpen] = useState(false);
  const [error, setError] = useState("");
  const majorsRef = useRef(null);
  const minorsRef = useRef(null);
  console.log(user)
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
        minorsRef.current &&
        !minorsRef.current.contains(event.target)
      ) {
        setIsMinorsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside); 
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ( !displayName ) {
      setError("Please enter a display name");
      return;
    }
    if ( selectedMajors.length == 0) {
      setError("Please select at least one major");
      return;
    }
    if (selectedMajors.some((item) => selectedMinors.includes(item))) {
      setError("You cannot major and minor in the same subject");
      return;
    }
    if ( !graduationSemester ) {
      setError("Please select your graduation semester");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    //TODO: rig form submission to backend.
    console.log(displayName, selectedMajors, selectedMinors, graduationSemester)
    try {
      await onboard(user, displayName, selectedMajors, selectedMinors, graduationSemester)
    } catch (error) {
      console.log("Error onboarding")
    }
    setTimeout(() => setIsLoading(false), 1500);
  };
  const handleMajorToggle = (major) => {
    setSelectedMajors((prev) =>
      prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major],
    );
  };
  const handleMinorToggle = (minor) => {
    setSelectedMinors((prev) =>
      prev.includes(minor) ? prev.filter((m) => m !== minor) : [...prev, minor],
    );
  };
  return (
    <div className="relative w-lg p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
        Complete your profile
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="pl-10 w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your display name"
            />
          </div>
        </div>
        <div ref={majorsRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Major(s)
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
        <div ref={minorsRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Minor(s)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedMinors.map((minor) => (
              <span
                key={minor.name}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-default"
              >
                {minor.name}
                <button
                  type="button"
                  onClick={() => handleMinorToggle(minor)}
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
              onClick={() => setIsMinorsOpen(!isMinorsOpen)}
              className="w-full p-2 text-left border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white flex justify-between items-center"
            >
              <span className="text-gray-500 dark:text-gray-400">
                {selectedMinors.length
                  ? `${selectedMinors.length} selected`
                  : "Select your minor(s)"}
              </span>
              <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </button>
            {isMinorsOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-auto">
                {allMajors.filter(
                  (major) => !selectedMinors.includes(major),
                ).map((major) => (
                  <button
                    key={major.name}
                    type="button"
                    onClick={() => handleMinorToggle(major)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {major.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
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

export default OnboardingForm;