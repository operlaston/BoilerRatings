import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  Flag,
  School,
  ArrowBigLeftDash,
  Plus,
  PencilLine,
  MessageSquare,
} from "lucide-react";

import RequirementForm from "../components/RequirementForm";
import PrerequisiteForm from "../components/PrerequisiteForm";
import ReviewTimeForm from "../components/ReviewTimeForm";
import ManageCourseForm from "../components/ManageCourseForm";
import EditInstructorForm from "../components/EditInstructorForm";
import { addInstructor, getInstructors } from "../services/instructor.service";
import { updateCourse, getCourses } from "../services/course.service";

import { AdminReports } from "../components/AdminReports";
import ReviewManagement from "../components/ReviewManagement";

function EditCourseForm({ courses, setCourses }) {
  const [selectedCourseName, setSelectedCourseName] = useState("");
  const [courseData, setCourseData] = useState({
    name: "",
    number: "",
    description: "",
    creditHours: 0,
    instructors: []
  });
  const [newInstructor, setNewInstructor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCourseChange = (e) => {
    const courseName = e.target.value;
    setSelectedCourseName(courseName);

    if (!courseName) {
      setCourseData({
        name: "",
        number: "",
        description: "",
        creditHours: 0,
        instructors: []
      });
      return;
    }

    // Find course in local state by name - JUST LIKE REVIEWTIMEFORM
    const course = courses.find(c => c.name === courseName);

    if (course) {
      setCourseData({
        name: course.name,
        number: course.number,
        description: course.description,
        creditHours: course.creditHours || 0,
        instructors: course.instructors.map(i => i.name || i._id?.toString() || i)
      });
    }
  };

  const handleAddInstructor = () => {
    if (!newInstructor.trim()) return;
    if (courseData.instructors.includes(newInstructor.trim())) {
      setError("Instructor already exists");
      return;
    }
    setCourseData(prev => ({
      ...prev,
      instructors: [...prev.instructors, newInstructor.trim()]
    }));
    setNewInstructor("");
    setError("");
  };

  const handleRemoveInstructor = (instructor) => {
    setCourseData(prev => ({
      ...prev,
      instructors: prev.instructors.filter(i => i !== instructor)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: name === "creditHours" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Find the full course object to get its ID
      const course = courses.find(c => c.name === selectedCourseName);

      await updateCourse(course.id, {
        ...courseData,
        // Ensure instructors are sent as array of strings/IDs
        instructors: courseData.instructors
      });

      setSuccess("Course updated successfully!");
      const updatedCourses = await getCourses();
      setCourses(updatedCourses);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Failed to update course");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen text-white p-4">
      <div className="text-lg">
        <label htmlFor="course-select">Select a course to edit: </label>
        <select
          id="course-select"
          value={selectedCourseName}
          onChange={handleCourseChange}
          className="border rounded-md p-1 bg-white dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Choose a Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.name}>
              {course.name} ({course.number})
            </option>
          ))}
        </select>
      </div>

      {selectedCourseName && (
        <div className="w-full max-w-2xl dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              {/* Read-only Course Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <div className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white">
                  {courseData.name}
                </div>
              </div>

              {/* Read-only Course Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Course Number</label>
                <div className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white">
                  {courseData.number}
                </div>
              </div>

              {/* Editable Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={courseData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                  rows={3}
                />
              </div>

              {/* Instructors Section (remains editable) */}
              <div>
                <label className="block text-sm font-medium mb-1">Instructors</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
                    placeholder="Add instructor"
                  />
                  <button
                    type="button"
                    onClick={handleAddInstructor}
                    className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>

                {courseData.instructors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {courseData.instructors.map((instructor, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
                        <span>{instructor}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInstructor(instructor)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error/Success messages and submit button remain the same */}
            {error && <div className="text-red-400">{error}</div>}
            {success && <div className="text-green-400">{success}</div>}

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function AdminPanel({ title, description, icon, stat, statLabel, onExpand }) {
  return (
    <div
      onClick={onExpand}
      className="relative p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {stat}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {statLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function ExpandedPanel({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AdminDashboard({
  activeUser,
  majors,
  setMajors,
  courses,
  setCourses,
}) {
const [instructorName, setInstructorName] = useState('');
const [instructorGPA, setInstructorGPA] = useState('');
const [instructorRMP, setInstructorRMP] = useState('');
const [instructorRMPLink, setInstructorRMPLink] = useState('');

const handleAddInstructor = (e) => {
  e.preventDefault();

  const newInstructor = {
    name: instructorName,
    gpa: parseFloat(instructorGPA),
    rmp: parseFloat(instructorRMP),
    rmpLink: instructorRMPLink
  };

  console.log("Submitting instructor:", newInstructor);
  try {
    addInstructor(instructorName, instructorGPA, instructorRMP, instructorRMPLink)
  } catch (error) {
    console.log("Error", error)
  }
}
const [instructorData, setInstructorData] = useState(null);
useEffect(() => {
    const fetchInstructors = async () => {
      const instructors = await getInstructors();
      setInstructorData(instructors); // assuming instructors is the data you want to set
    };

    fetchInstructors();
  }, []);
  const [expandedPanel, setExpandedPanel] = useState("");
  const mockData = {
    instructors: 42,
    reports: 7,
    majors: 24,
  };
  if (!activeUser || !activeUser.admin) {
    return <div>Access forbidden: You are not an admin</div>;
  }

    let coursesWithoutPrereqs = 0;
    let coursesUnreviewable = 0;
    for (const course of courses) {
        if (course.prerequisites.length === 0) coursesWithoutPrereqs++;
        const date = new Date(course.timeToReview).getTime() > new Date(Date.now()).getTime()
        if (date) coursesUnreviewable++;
    }

  return (
    <div className="w-full h-screen dark:bg-gray-900">
      <div className="relative w-full max-w-7xl mx-auto p-6">
        {/* Decorative Elements */}
        <div className="relative">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Admin Dashboard
            </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminPanel
              title="Manage Instructors"
              description="Add or modify instructor information"
              icon={
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
              stat={mockData.instructors}
              statLabel="Total Instructors"
              onExpand={() => setExpandedPanel("instructors")}
            />
            <AdminPanel
              title="Reports"
              description="Handle user reports and issues"
              icon={
                <Flag className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
              stat={mockData.reports}
              statLabel="Unresolved Reports"
              onExpand={() => setExpandedPanel("reports")}
            />
            <AdminPanel
              title="Major Management"
              description="Edit major information and requirements"
              icon={
                <School className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
              stat={majors.length}
              statLabel="Active Majors"
              onExpand={() => setExpandedPanel("majors")}
            />
            <AdminPanel
              title="Course Management"
              description="Delete or add courses"
              icon={
                <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
              stat={courses.length}
              statLabel="Courses available"
              onExpand={() => setExpandedPanel("courses")}
            />
            <AdminPanel
              title="Prerequisites"
              description="Delete or add prerequisites"
              icon={
                <ArrowBigLeftDash className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
              stat={coursesWithoutPrereqs}
              statLabel="Courses without prerequisites"
              onExpand={() => setExpandedPanel("prerequisites")}
            />
            <AdminPanel
              title="Course Reviews"
              description="Manage which Courses can be reviewed"
              icon={
                <PencilLine className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              }
              stat={coursesUnreviewable}
              statLabel="Courses that can't be reviewed"
              onExpand={() => setExpandedPanel("courseReviews")}
            />
            <AdminPanel
              title="Edit Courses"
              description="Modify course details and instructors"
              icon={<PencilLine className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
              stat={courses.length}
              statLabel="Courses available"
              onExpand={() => setExpandedPanel("editCourses")}
            />
             {/* New AdminPanel for Review Management */}
             <AdminPanel
              title="Review Management"
              description="View and delete user reviews"
              icon={<MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
              stat="View"
              statLabel="Manage Reviews"
              onExpand={() => setExpandedPanel("reviews")}
            />
          </div>
        </div>
        {/* Expanded Panels */}
        {expandedPanel === "instructors" && (
          <ExpandedPanel
            title="Instructor Management"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add New Instructor
                </h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={instructorName}
                      onChange={(e) => setInstructorName(e.target.value)}
                      id="instructorName"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter instructor name"
                    />
                  </div>

                  <div>
                    <label htmlFor="instructorGPA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GPA
                    </label>
                    <input
                      type="number"
                      id="instructorGPA"
                      min="0"
                      max="4"
                      step="0.1"
                      value={instructorGPA}
                      onChange={(e) => setInstructorGPA(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter GPA (0-4)"
                    />
                  </div>

                  <div>
                    <label htmlFor="instructorRMP" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RateMyProfessor Rating
                    </label>
                    <input
                      type="number"
                      id="instructorRMP"
                      min="0"
                      max="5"
                      step="0.1"
                      value={instructorRMP}
                      onChange={(e) => setInstructorRMP(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter RMP rating (0-5)"
                    />
                  </div>

                  <div>
                    <label htmlFor="instructorRMPLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RateMyProfessor Link
                    </label>
                    <input
                      type="url"
                      id="instructorRMPLink"
                      value={instructorRMPLink}
                      onChange={(e) => setInstructorRMPLink(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter RMP profile URL"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleAddInstructor}
                      className="px-4 py-2 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 transition-colors"
                    >
                      Add Instructor
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Edit / Delete Instructor
                </h3>
                <EditInstructorForm instructors={instructorData}/>
              </div>
            </div>
          </ExpandedPanel>
        )}
        {expandedPanel === "reports" && (
          <ExpandedPanel
            title="Report Management"
            onClose={() => setExpandedPanel(null)}
          >
            <AdminReports />
          </ExpandedPanel>
        )}
        {expandedPanel === "majors" && (
          <ExpandedPanel
            title="Major Management"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Edit Major Information
                </h3>
                {/* Major editing interface would go here */}
              </div>
              <RequirementForm
                majors={majors}
                setMajors={setMajors}
                courses={courses}
              />
            </div>
          </ExpandedPanel>
        )}
        {expandedPanel === "courses" && (
          <ExpandedPanel
            title="Course Management"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <ManageCourseForm />
            </div>
          </ExpandedPanel>
        )}
        {expandedPanel === "prerequisites" && (
          <ExpandedPanel
            title="Prerequisites"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add or Remove Prerequisites
                </h3>
                {/* Major editing interface would go here */}
              </div>
              <PrerequisiteForm courses={courses} setCourses={setCourses} />
            </div>
          </ExpandedPanel>
        )}
        {expandedPanel === "courseReviews" && (
          <ExpandedPanel
            title="Prerequisites"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Set time for reviews to become available
                </h3>
                {/* Major editing interface would go here */}
              </div>
              <ReviewTimeForm courses={courses} setCourses={setCourses} />
            </div>
          </ExpandedPanel>
        )}
        {expandedPanel === "editCourses" && (
          <ExpandedPanel
            title="Edit Courses"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <EditCourseForm courses={courses} setCourses={setCourses} />
            </div>
          </ExpandedPanel>
        )}
        {/* New Expanded Panel for Review Management */}
        {expandedPanel === "reviews" && (
          <ExpandedPanel
            title="Review Management"
            onClose={() => setExpandedPanel(null)}
          >
            <ReviewManagement />
          </ExpandedPanel>
        )}
      </div>
    </div>
  );
}