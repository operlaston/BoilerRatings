import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { getInstructors, saveInstructor } from "../services/instructor.service";
import { getCourseByName } from "../services/course.service";

/**
 * EditInstructorForm
 * -------------------
 * 1. Search for an instructor by name (placeholder fetch in `handleFindInstructor`).
 * 2. When found, pre‑fill an editable form with the instructor’s data.
 * 3. "Courses" follows the same input format as prerequisites in ManageCoursesForm:
 *    - Comma‑separated courses within a group, semicolon‑separated between groups.
 *      Example → "CS 180,MATH 161; ENGL 203"  ⇒ [["CS 180","MATH 161"],["ENGL 203"]]
 * 4. Submit button is disabled until **all** fields contain a value.
 * 5. An additional **Delete Instructor** section allows deleting the current instructor with a confirmation popup.
 * 6. All network operations are mocked with console.log calls.
 */

 

const EditInstructorForm = (instructors) => {
  const [searchName, setSearchName] = useState("");
  const [instructorList, setInstructorList] = useState(instructors)
  const [instructorData, setInstructorData] = useState(null);
  const [error, setError] = useState("");
  console.log("InstructorList", instructorList)
  // editable form values
  const [formData, setFormData] = useState({
    name: "",
    gpa: "",
    rmp: "",
    rmpLink: "",
    coursesRaw: "",
  });

  // delete instructor
  const [instructorToDelete, setInstructorToDelete] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const parseCourses = (input) =>
    input
      .split(",")
      .filter((group) => group.length);

  const isDisabled =
    !formData.name.trim() ||
    !formData.gpa.toString().trim() ||
    !formData.rmp.toString().trim() ||
    !formData.rmpLink.trim() ||
    !formData.coursesRaw.trim();

  const handleFindInstructor = async () => {
    setError("");

    try {
      const match = instructorList.instructors.find(
        (instructor) =>
          instructor.name.toLowerCase().trim() === searchName.toLowerCase().trim()
      );
  
      if (!match) {
        throw new Error("Instructor not found");
      }
  
      setInstructorData(match);
    } catch (err) {
      setError(err.message || "Failed to fetch instructor");
    }
  };

  // populate form when data arrives
  useEffect(() => {
    if (!instructorData) return;
    setFormData({
      name: instructorData.name || "",
      gpa: instructorData.gpa?.toString() || "",
      rmp: instructorData.rmp?.toString() || "",
      rmpLink: instructorData.rmpLink || "",
      coursesRaw: instructorData.courses?.map((c) => c.number).join(", ") || "",
    });
    // also prefill delete input with instructor name for convenience
    setInstructorToDelete(instructorData.name || "");
  }, [instructorData]);
  console.log("Instructor Data", instructorData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDisabled) return;
    const courses = parseCourses(formData.coursesRaw).map(course =>
      course.replace(/\s+/g, '').toLowerCase()
    );
    const courseIds = (
      await Promise.all(
        courses.map(async (courseName) => {
          const course = await getCourseByName(courseName);
          return course?.id || null;
        })
      )
    ).filter(Boolean);
    console.log(courses)
    console.log(courseIds)
    const instructor = {
      name: formData.name.trim(),
      gpa: Number(formData.gpa),
      rmp: Number(formData.rmp),
      rmpLink: formData.rmpLink.trim(),
      courses: parseCourses(formData.coursesRaw),
    };

    saveInstructor(instructorData.id, instructor.name, instructor.gpa, instructor.rmp, instructor.rmpLink, courseIds)
    console.log("[MOCK] Save instructor:", instructor);
    setInstructorData(null);
    setFormData({ name: "", gpa: "", rmp: "", rmpLink: "", coursesRaw: "" });
  };

  // Delete instructor
  const handleDeleteInstructor = async () => {
    console.log(`[MOCK] Would delete instructor: ${instructorToDelete}`);
    setInstructorToDelete("");
    setShowDeletePopup(false);
    setInstructorData(null);
    setFormData({ name: "", gpa: "", rmp: "", rmpLink: "", coursesRaw: "" });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-md rounded-md space-y-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter instructor name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="text-white w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white/90 dark:bg-gray-800/80 placeholder-gray-400 dark:placeholder-gray-100 
                     focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
        />
        <button
          type="button"
          onClick={handleFindInstructor}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Find Instructor
        </button>
      </div>

      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

      {instructorData && (
        <>
          {/* EDIT FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* GPA */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                GPA *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) =>
                  setFormData({ ...formData, gpa: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* RMP Rating */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                RateMyProf Rating *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rmp}
                onChange={(e) =>
                  setFormData({ ...formData, rmp: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* RMP Link */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                RateMyProf Link *
              </label>
              <input
                type="url"
                value={formData.rmpLink}
                onChange={(e) =>
                  setFormData({ ...formData, rmpLink: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
                required
              />
            </div>

            {/* Courses */}
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Courses *
                <span className="text-xs text-gray-500 ml-2">
                  Format: "CS 101,CS 102; ENGL 203" → [[CS 101, CS 102], [ENGL
                  203]]
                </span>
              </label>
              <input
                type="text"
                value={formData.coursesRaw}
                onChange={(e) =>
                  setFormData({ ...formData, coursesRaw: e.target.value })
                }
                className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
                placeholder="Enter courses separated by commas; groups by semicolons"
                required
              />
            </div>

            {/* Action Button */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isDisabled}
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                           p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors 
                           disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center gap-2"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Delete Instructor */}
          <div className="mt-6">
            <div className="flex gap-4 items-center">
              <button
                onClick={() => instructorToDelete && setShowDeletePopup(true)}
                disabled={!instructorToDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg
                           hover:bg-red-700 transition-colors disabled:opacity-50
                           disabled:cursor-not-allowed"
              >
                {`Delete ${instructorToDelete}`}{" "}
              </button>
            </div>
          </div>

          {/* Delete Confirmation Popup */}
          {showDeletePopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="relative bg-gray-800 p-6 rounded-lg border border-red-600 w-full max-w-md">
                <div
                  className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => setShowDeletePopup(false)}
                >
                  <IoMdClose className="h-6 w-6" />
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-200">
                    Confirm deletion of instructor:
                    <span className="text-red-400 ml-2">
                      {instructorToDelete}
                    </span>
                  </h3>
                  <p className="mt-2 text-red-500 text-sm">
                    Warning: This action cannot be undone
                  </p>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleDeleteInstructor}
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
        </>
      )}
    </div>
  );
};

export default EditInstructorForm;
