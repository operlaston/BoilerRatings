import React, { useState } from "react";
import {
  X,
  Users,
  Flag,
  School,
  ArrowBigLeftDash,
  Plus,
  PencilLine,
} from "lucide-react";

import RequirementForm from "../components/RequirementForm";
import PrerequisiteForm from "../components/PrerequisiteForm";
import ReviewTimeForm from "../components/ReviewTimeForm";
import ManageCourseForm from "../components/ManageCourseForm";

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
    const date = new Date(course.timeToReview);
    const date2 = new Date(Date.now());
    if (date.getTime() < date2.getTime()) coursesUnreviewable++;
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
                {/* Add instructor form would go here */}
              </div>
            </div>
          </ExpandedPanel>
        )}
        {expandedPanel === "reports" && (
          <ExpandedPanel
            title="Report Management"
            onClose={() => setExpandedPanel(null)}
          >
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Unresolved Reports
                </h3>
                {/* Reports list would go here */}
              </div>
            </div>
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
      </div>
    </div>
  );
}
