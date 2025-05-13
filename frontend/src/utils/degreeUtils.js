export const aggregateCoreRequirementsIntoArray = (majors) => {
  let userAllCoreRequirements = [];

  majors.forEach(major => {
    const coreRequirements = major.requirements.filter((req) => req.name.includes("Core"));
    coreRequirements.forEach(core => {
      const filteredSubrequirements = core.subrequirements.filter((subreq) => subreq.courses.length === 1);
      filteredSubrequirements.forEach(subreq => {
        userAllCoreRequirements.push(subreq.courses[0]);
      });
    });
  });

  return userAllCoreRequirements;
};


export const sortCoursesForAutofill = (coreCourses, allCourses) => {
  console.log(coreCourses, allCourses);
  console.log("Core course objects", allCourses.filter(course => coreCourses.includes(course.name)));
  const coursePrereqMap = {};
  const coreSet = new Set(coreCourses);
  const courseMap = new Map();
  allCourses.forEach(course => courseMap.set(course.name, course));
  const missingPrereqs = new Set();

  // First, build a map of all core courses with their filtered prerequisites
  allCourses.forEach(course => {
    if (coreSet.has(course.name)) {
      console.log(prereqGroup);
      const filteredPrereqs = (course.prerequisites || []).map(prereqGroup => {
        const hasCoreCourse = prereqGroup.some(prereq => coreSet.has(prereq));
        if (!hasCoreCourse) {
          const firstPrereq = prereqGroup[0];
          missingPrereqs.add(firstPrereq);
          return firstPrereq;
        }
      });

      coursePrereqMap[course.name] = filteredPrereqs.map(prereq => [prereq]);
    }
  });



  console.log("Course prerequisite map", coursePrereqMap);

  missingPrereqs.forEach(prereq => {
    if (courseMap.has(prereq)) {
      coreCourses.push(prereq);
      coreSet.add(prereq);
      coursePrereqMap[prereq] = (courseMap.get(prereq).prerequisites || []).map(prereqGroup =>
        prereqGroup.length > 0 ? [prereqGroup[0]] : null
      ).filter(Boolean);
    }
  });
  console.log("Course Prereq Map after filling", coursePrereqMap);
  const allSortedCourses = Array.from(coreSet)
  // Initialize visited and visiting sets for cycle detection
  const visited = new Set();
  const visiting = new Set();
  const result = [];

  // Helper function for topological sort
  function visit(courseName) {
    if (visiting.has(courseName)) {
      console.warn(`Circular dependency detected involving course ${courseName}`);
      return;
    }

    if (visited.has(courseName)) {
      return; // Already processed
    }

    visiting.add(courseName);

    // Visit all prerequisites first
    const prereqGroups = coursePrereqMap[courseName] || [];
    for (const group of prereqGroups) {
      group.forEach(courseName => {
        if (courseMap.has(courseName)) {
          visit(courseName);
        }
      });
    }

    visiting.delete(courseName);
    visited.add(courseName);
    result.push(courseMap.get(courseName));
  }

  // Visit each core course
  allSortedCourses.forEach(courseName => {
    if (!visited.has(courseName)) {
      visit(courseName);
    }
  });

  return (result);
}