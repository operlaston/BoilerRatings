import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from "jspdf";
import { Search, AlertCircle, Trash, FileDown, Save, CalendarSync, CalendarHeart, Settings2, Flag, Star } from "lucide-react";
import "../styles/App.css"
import { getCourses } from "../services/course.service";
import { createDegreePlan, getMajorById } from "../services/degreeplan.service";
import SaveDegreeForm from "../components/SaveDegreeForm";
import DegreePlannersettingsForm from "../components/DegreePlannerSettingsForm";
import { LoadingPage } from "../components/Loading";
import ReportForm from "../components/ReportForm";
import { sendReport } from "../services/pagereport.service";

//Need to set INITIAL_CLASSES to all classes in the data base
//const INITIAL_CLASSES = await getCourses()

const INITIAL_SEMESTERS = [
  {
    semester: "Fall 2023",
    semesterIndex: 0,
    courses: [],
  },
  {
    semester: "Spring 2024",
    semesterIndex: 1,
    courses: [],
  },
  {
    semester: "Fall 2024",
    semesterIndex: 2,
    courses: [],
  },
  {
    semester: "Spring 2025",
    semesterIndex: 3,
    courses: [],
  },
  {
    semester: "Fall 2025",
    semesterIndex: 4,
    courses: [],
  },
  {
    semester: "Spring 2026",
    semesterIndex: 5,
    courses: [],
  },
  {
    semester: "Fall 2026",
    semesterIndex: 6,
    courses: [],
  },
  {
    semester: "Spring 2027",
    semesterIndex: 7,
    courses: [],
  },
]

const DATA_COURSE_ORDER = [
  ["CS 18000", "MA 16100"],
  ["CS 18200", "MA 16200"],
  ["CS 38003", "MA 26100"],
  ["CS 24200", "STAT 35500", "MA 26500"],
  ["CS 25100", "CS 25300", "STAT 41600"],
  ["CS 37300", "STAT 41700"],
  ["CS 44000"],
  ["CS 44100"]
]

export const aggregateCoreRequirementsIntoArray = (majors) => {
  console.log("Majors", majors);
  let userAllCoreRequirements = [];

  majors.forEach(major => {
    const coreRequirements = major.requirements.filter((req) => req.name.includes("Core"));
    // GET ONLY CORE REQUIREMENTS
    console.log("Core requirements: ", coreRequirements);
    coreRequirements.forEach(core => {
      const filteredSubrequirements = core.subrequirements.filter((subreq) => subreq.courses.length == 1);
      //FOR NOW, only get subrequirements that have one course. 
      filteredSubrequirements.forEach(subreq => {
        userAllCoreRequirements.push(subreq.courses[0]);
      })
    })
  });
  return userAllCoreRequirements;
}

export const sortCoursesForAutofill = (coreCourses, allCourses) => {
  const coursePrereqMap = {};
  const coreSet = new Set(coreCourses);
  const courseMap = new Map();
  allCourses.forEach(course => courseMap.set(course.name, course));
  const missingPrereqs = new Set();

  // First, build a map of all core courses with their filtered prerequisites
  allCourses.forEach(course => {
    if (coreSet.has(course.name)) {
      const filteredPrereqs = (course.prerequisites || []).map(prereqGroup => {
        const hasCoreCourse = prereqGroup.some(prereq => coreSet.has(prereq));
        if (!hasCoreCourse) {
          const firstPrereq = prereqGroup[0];
          missingPrereqs.add(firstPrereq);
          return firstPrereq;
        }
        //We have a core course as a prereq
        const corecoursehit = prereqGroup.find(prereq => coreSet.has(prereq))
        return corecoursehit
        
      });
      console.log("Filter Prereqs", filteredPrereqs);
      coursePrereqMap[course.name] = filteredPrereqs.map(prereq => [prereq]);
    }
  });




  missingPrereqs.forEach(prereq => {
    if (courseMap.has(prereq)) {
      coreCourses.push(prereq);
      coreSet.add(prereq);
      coursePrereqMap[prereq] = (courseMap.get(prereq).prerequisites || []).map(prereqGroup =>
        prereqGroup.length > 0 ? [prereqGroup[0]] : null
      ).filter(Boolean);
    }
  });
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

export const sortCoursesForAutofillLowestDifficulty = (coreCourses, allCourses) => {
  const coursePrereqMap = {};
  const coreSet = new Set(coreCourses);
  const courseMap = new Map();
  allCourses.forEach(course => courseMap.set(course.name, course));
  console.log(courseMap)
  const missingPrereqs = new Set();

  // First, build a map of all core courses with their filtered prerequisites
  allCourses.forEach(course => {
    if (coreSet.has(course.name)) {
      console.log(course.name)
      const filteredPrereqs = (course.prerequisites || []).map(prereqGroup => {
        const hasCoreCourse = prereqGroup.some(prereq => coreSet.has(prereq));
        if (!hasCoreCourse) {
          let lowestDiff = prereqGroup[0];
          let lowestDiffNum = courseMap.get(prereqGroup[0]).difficulty
          let currentDiff;
          let currentDiffNum;
          let i;
          console.log(lowestDiff);
          console.log(lowestDiffNum)
          for (i = 0; i < prereqGroup.length; i++) {
            currentDiff = prereqGroup[i];
            console.log(currentDiff)
            currentDiffNum = courseMap.get(prereqGroup[i]).difficulty
            console.log(currentDiffNum)
            if (currentDiffNum < lowestDiffNum) {
              lowestDiff = currentDiff;
              lowestDiffNum = currentDiffNum;
            }
          }
          console.log("Lowest Found was", lowestDiff)
          missingPrereqs.add(lowestDiff)
          return lowestDiff;
        }
      });

      coursePrereqMap[course.name] = filteredPrereqs.map(prereq => [prereq]);
    }
  });

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


export default function DegreePlanner({ user, setUser, degreePlan }) {
  const [semesters, setSemesters] = useState(INITIAL_SEMESTERS)
  const [availableCourses, setAvailableCourses] = useState([])
  const [courses, setCourses] = useState([]); // Initial courses state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [errors, setErrors] = useState([]); // Errors state
  const [active, setActive] = useState(false);
  const [missingRequirements, setMissingRequirements] = useState([]);
  const [isSaved, setIsSaved] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupState, setPopupState] = useState("Save");
  const [degreePlanName, setDegreePlanName] = useState("My Degree Plan");
  const [majors, setMajors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [showFavorited, setShowFavorited] = useState(false);
  const [semesterDisplayState, setsemesterDisplayState] = useState("Hours");
  const [suggestedCourses, setsuggestedCourses] = useState([]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      // Fetch both courses and major in parallel
      const [courses, userMajorObjects] = await Promise.all([
        (async () => {
          const courses = await getCourses();
          const availableCourses = courses.map((course) => ({
            courseID: course.id,
            name: course.number,
            semester: "",
            semesterIndex: -1,
            description: course.name,
            difficulty: course.difficulty,
            creditHours: course.creditHours,
            prerequisites: course.prerequisites,
            corequisites: [],
            conflicts: [],
            numReviews: course.reviews.length,
            suggested: false
          }));
          if (!user) {
            const savedData = localStorage.getItem("degreeData");
            if (savedData) {
              const updatedCourses = JSON.parse(savedData);
              const savedCourseIDs = updatedCourses.map(course => course.courseID);
              const updatedAvailableCourses = availableCourses.filter(course => !savedCourseIDs.includes(course.courseID));
              setCourses(updatePrerequisiteErrors(updatedCourses));
              setAvailableCourses(updatedAvailableCourses);
              return updatedCourses;
            }
          }

          if (degreePlan) {
            const getCourses = degreePlan.savedCourses;
            console.log(degreePlan);
            const savedCourseIDs = degreePlan.savedCourses.map(course => course._id);
            const updatedAvailableCourses = availableCourses.filter(course => !savedCourseIDs.includes(course.course));

            const updatedCourses = getCourses.map((course) => {
              return {
                courseID: course.course.id,
                name: course.course.number,
                semester: course.semester,
                semesterIndex: course.semesterIndex,
                description: course.course.name,
                difficulty: course.course.difficulty,
                creditHours: course.course.creditHours,
                prerequisites: course.course.prerequisites,
                corequisites: [],
                conflicts: [],
                numReviews: course.reviews.length,
                suggested: false
              };
            });
            setCourses(updatePrerequisiteErrors(updatedCourses));
            setAvailableCourses(updatedAvailableCourses);
            return updatedCourses;
          } else {
            setCourses([]);
            setAvailableCourses(availableCourses);
            return [];
          }
        })(),
        (async () => {
          if (user) {
            let majorIds = user.major;
            if (majorIds.length > 0) {
              if (typeof majorIds[0] !== "string") {
                majorIds = majorIds.map(majorObj => majorObj.id)
              }
            }
            const promises = [];
            for (const id of majorIds) {
              promises.push(getMajorById(id));
            }
            const majors = await Promise.all(promises);
            setMajors(majors);
            return majors;
          }
          return null;
        })()
      ]);
      if (!user) {
        if (!localStorage.getItem("majors")) {
          setMajors([]);
        }
        else {
          setMajors(JSON.parse(localStorage.getItem("majors")));
        }
      }
      else {
        setMajors(userMajorObjects);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching initial data", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const updateSuggestedStars = () => {
    courses.filter(course => course.suggested).forEach(course => {
      course.suggested = false;
    })
    availableCourses.filter(course => course.suggested).forEach(course => {
      course.suggested = false;
    })
  }

  const searchFilteredCourses = (() => {
    updateSuggestedStars();
    if (!searchQuery.trim()) return availableCourses.slice(0, 20);
    // Split into OR groups, then flatten to get all terms
    const orGroups = searchQuery
      .split(/\s+AND\s+/i)
      .map(group =>
        group
          .split(/\s+OR\s+/i)
          .map(term => term.trim().replace(/\s+/g, '').toLowerCase())
      );
  
    // Flatten all terms from all OR groups
    const allTerms = orGroups.flat();
  
    // Match any course that includes any term
    let matchedCourses = availableCourses.concat(courses).filter(course => {
      const normalizedCourse = course.name.replace(/\s+/g, '').toLowerCase();
      return allTerms.some(term => {
        const normalizedTerm = term.replace(/\s+/g, '').toLowerCase();
        return normalizedCourse.startsWith(normalizedTerm);
      });
    });
    
    if (searchQuery.includes("OR")) {
      // Star lowest-difficulty course in each OR group
      orGroups.forEach(group => {
        const matches = matchedCourses.filter(course => {
          const normalizedName = course.name.replace(/\s+/g, '').toLowerCase();
          return group.some(term => normalizedName.includes(term));
        });
        if (matches.length == 1) {
          matches[0].suggested = true;
        }
        else if (matches.length > 0) {
          const matchesWithReviews = matches.filter(course => course.numReviews > 0);
          const easiest = matchesWithReviews.reduce((a, b) =>
            a.difficulty < b.difficulty ? a : b
          );
          easiest.suggested = true;
        }
      });
    }

    // Optional: Filter by favorites
    // if (showFavorited) {
    //   matchedCourses = matchedCourses.filter(course =>
    //     user.favorited.includes(course.courseID)
    //   );
    // }

    //Include courses alr in degree plan for calculations, but filter them out of search
    matchedCourses = matchedCourses.filter(c => !courses.includes(c));

    //filter results by starred results first
    matchedCourses.sort((a, b) => {
      if (a.suggested && !b.suggested) return -1;
      if (!a.suggested && b.suggested) return 1; 
      return 0;
    });
    
  
    return matchedCourses.slice(0, 20);
  })();


  const closePopup = () => {
    setIsPopupVisible(false);
  };
  const handleSettingsClick = () => {
    if (isLoading) {
      return;
    }
    setPopupState("Settings");
    setIsPopupVisible(true);
  }
  const handleReportClick = () => {
    if (isLoading) {
      return;
    }
    setPopupState("Report");
    setIsPopupVisible(true);
  }
  const handleReportFormSubmit = ( reportContent ) => {
    sendReport("Degree Planner Page", reportContent)
    setIsPopupVisible(false);
    toast.success('Thanks for your feedback!')
  }

  //Functions related to saving degree

  useEffect(() => { //hook for warning unsaved changes
    const handleBeforeUnload = (event) => {
      if (!isSaved) {
        event.preventDefault();
        event.returnValue = '';
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
        if (confirmLeave) {
          return;
        } else {
          event.returnValue = '';
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSaved]);
  const handleSaveClick = () => { //handle save button clicked
    if (isLoading) {
      return;
    }
    if (!user) {
      localStorage.setItem("degreeData", JSON.stringify(courses));
      toast.success('Saved degree plan to local storage!')
      setIsSaved(true);
    }
    else {
      setPopupState("Save");
      setIsPopupVisible(true);
    }
  }
  const handleSaveDegreePlan = (degreePlanName) => { //handle save to database
    if (degreePlanName.trim() === "") {
      alert("Please provide a name for the degree plan.");
      return;
    }
    if (!user) {
      //This should not happen
      return;
    }
    createDegreePlan(user, degreePlanName, courses)
    setIsSaved(true);
    setIsPopupVisible(false);
  };


  //Functions related to dragging and dropping courses

  const handleDragStart = (e, course) => {
    e.dataTransfer.setData("name", course.name); // Set the name in dataTransfer
  };
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
    setActive(true);
  };
  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setActive(false); // Only deactivate if the dragged element leaves the parent div
    }
  }
  const handleDragEnd = (e) => {
    if (isLoading) {
      return;
    }
    setIsSaved(false);
    let name = e.dataTransfer.getData("name");
    if (courses.some((c) => c.name === name)) {
      //This means the course is in the search bar
      let availableCoursesCopy = [...availableCourses];
      let currentCourses = [...courses];
      let courseIndex = currentCourses.findIndex((c) => c.name == name)
      let courseToTransfer = currentCourses.splice(courseIndex, 1)[0];
      courseToTransfer.semester = "";
      courseToTransfer.semesterIndex = -1;
      courseToTransfer.conflicts = [];
      availableCoursesCopy.push(courseToTransfer);
      setAvailableCourses(availableCoursesCopy);
      setCourses(updatePrerequisiteErrors(currentCourses));
      let updatedSemesters = semesters.map((s) => ({
        ...s,
        courses: s.courses.filter((c) => c.name !== name)
      }));
      setSemesters(updatedSemesters);
    }
    setActive(false);
  }

  //Functions related to handling prerequisites

  const checkPrerequisites = (course, courses) => {
    const filteredCourses = courses.filter((c) => c.semesterIndex < course.semesterIndex);
    const filteredname = new Set(filteredCourses.map(c => c.name));

    // Find all prerequisite groups that are not fulfilled
    const unfulfilledPrereqGroups = course.prerequisites.filter(prereqGroup =>
      !prereqGroup.some(prereq => filteredname.has(prereq))
    );
    return unfulfilledPrereqGroups;
  }
  const updatePrerequisiteErrors = (reorderedCourses) => {
    const updatedCourses = reorderedCourses.map((course) => {
      const conflicts = checkPrerequisites(course, reorderedCourses);
      return { ...course, conflicts }; // Update the conflicts field
    });
    const updatedErrors = errors.filter((err) => err.errorType !== "prerequisite_conflict");
    updatedCourses.forEach((course) => {
      if (course.semesterIndex == -1) {
        return;
      }
      if (course.conflicts.length > 0) {
        updatedErrors.push({
          errorType: "prerequisite_conflict",
          clickAction: "search_prerequisites",
          prerequisites: course.conflicts,
          course: course.name,
          semester: course.semester,
        });
      }
    });
    setErrors(updatedErrors);
    return updatedCourses;
  }

  //Functions related to error checking

  const getErrorMessages = (array) => { //
    let formattedErrorArray = [];

    let notEnoughHoursArray = errors.filter((err) => err.errorType === "not_enough_hours");
    if (notEnoughHoursArray.length != 0) {
      let NOT_ENOUGH_HOURS = "Not enough hours in ";
      NOT_ENOUGH_HOURS += notEnoughHoursArray
        .map((err) => err.semester)
        .join(", ");

      formattedErrorArray.push(NOT_ENOUGH_HOURS);
    }

    let prerequisiteConflictArray = errors.filter((err) => err.errorType === "prerequisite_conflict");
    if (prerequisiteConflictArray.length != 0) {
      let PREREQUISITE_CONFLICT = "You must take ";

      PREREQUISITE_CONFLICT +=
        prerequisiteConflictArray.map((err) => {
          return err.prerequisites.map(group => `(${group.join(" OR ")})`).join(" AND ") + " before " + err.course;
        })
          .join(", ")
      formattedErrorArray.push(PREREQUISITE_CONFLICT);
    }
    return formattedErrorArray;
  }
  useEffect(() => { //Hook for updating requirements
    let arr = [];
    majors.forEach(major => {
      major.requirements.forEach(requirement => {
        let missingRequirement = {
          name: requirement.name,
          courses: []
        }
        requirement.subrequirements.forEach(subreq => {
          if (!courses.some(course => subreq.courses.includes(course.name))) {
            missingRequirement.courses.push(subreq.courses);
          }
        })
        if (missingRequirement.courses.length > 0) {
          arr.push(missingRequirement);
        }
      });
    })
    console.log(arr);
    setMissingRequirements(arr);
  }, [courses, majors]);
  const handleErrorClick = (requirement) => {
    setSearchQuery(requirement.courses.map(group => group.join(" OR ")).join(" AND "));
  }

  // Generate the PDF
  const handleCreatePDF = () => {
    if (isLoading) {
      return;
    }
    try {
      if (!semesters?.length) {
        throw new Error("No semester data available");
      }

      const doc = new jsPDF();

      // Purdue colors
      const PURDUE_GOLD = [206, 184, 136];
      const PURDUE_BLACK = [0, 0, 0];
      const LIGHT_GRAY = [240, 240, 240];

      // Header with Purdue colors
      doc.setFillColor(...PURDUE_GOLD);
      doc.rect(0, 0, 210, 15, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...PURDUE_BLACK);
      doc.text(`My Purdue Degree Plan:`, 105, 10, { align: 'center' });

      // Student info
      doc.setFontSize(12);
      if (user) {
        doc.text(`Boilermaker: ${user.username}`, 14, 25);
        if (user.firstName && user.lastName) {
          doc.text(`Name: ${user.firstName} ${user.lastName}`, 14, 35);
        }
      }
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, user?.firstName ? 45 : 35);

      // Gold line separator
      doc.setDrawColor(...PURDUE_GOLD);
      doc.setLineWidth(0.5);
      doc.line(14, user?.firstName ? 50 : 40, 196, user?.firstName ? 50 : 40);

      // Content
      let yPosition = user?.firstName ? 60 : 50;

      semesters.forEach(semester => {
        const semesterCourses = courses.filter(c => c.semester === semester.semester);

        if (yPosition > 260) {
          doc.addPage();
          yPosition = 20;
        }

        // Semester header
        doc.setFillColor(...PURDUE_GOLD);
        doc.rect(14, yPosition - 5, 182, 10, 'F');
        doc.setFontSize(14);
        doc.text(`${semester.semester}:`, 16, yPosition);

        if (semesterCourses.length > 0) {
          // Table header
          doc.setFillColor(...LIGHT_GRAY);
          doc.rect(14, yPosition + 5, 182, 8, 'F');
          doc.setFontSize(12);
          doc.text("Course", 16, yPosition + 10);
          doc.text("Title", 56, yPosition + 10);
          doc.text("Credits", 170, yPosition + 10, { align: "right" });

          yPosition += 15;

          // Courses
          let semesterHours = 0;

          semesterCourses.forEach(course => {
            doc.setTextColor(...PURDUE_BLACK);
            doc.text(course.name, 16, yPosition + 5);

            let description = course.description;
            if (doc.getStringUnitWidth(description) * 3 > 100) {
              description = doc.splitTextToSize(description, 100)[0] + "...";
            }
            doc.text(description, 56, yPosition + 5);

            doc.text(course.creditHours.toString(), 170, yPosition + 5, { align: "right" });

            semesterHours += course.creditHours;
            yPosition += 8;

            if (yPosition > 260) {
              doc.addPage();
              yPosition = 20;
            }
          });

          // Semester total
          doc.text(`Total Credits: ${semesterHours}`, 170, yPosition + 5, { align: "right" });
          yPosition += 10;
        } else {
          doc.setFontSize(12);
          doc.text("No courses scheduled", 20, yPosition + 10);
          yPosition += 20;
        }

        yPosition += 10;
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(...PURDUE_GOLD);
      doc.text("Boiler Up!", 105, 285, { align: 'center' });

      // Fixed this line - was using mismatched quotes
      doc.save(`${degreePlanName || 'purdue_degree_plan'}.pdf`);

    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    }
  };

  const handleAutoFillClick = () => {
    if (isLoading) {
      return;
    }
    console.log(majors);
    
    let coreCourses = aggregateCoreRequirementsIntoArray(majors);
    let topologicalCourses = sortCoursesForAutofill(coreCourses, courses.concat(availableCourses));
    console.log("Core courses after topological sort: ", topologicalCourses);
    let courseOrder = [[topologicalCourses[0]]];

    for (let i = 1; i < topologicalCourses.length; i++) {
      let curr = topologicalCourses[i];
      let highest = -1;
      //console.log("curr", curr)
      curr.prerequisites.forEach(prereqGroup => {
        // console.log("This prereq group has ", prereqGroup)
        courseOrder.forEach((s, index) => {
          //console.log("This semester has ", s);
          if (s.some(course => prereqGroup.includes(course.name))) {
            if (index > highest) {
              highest = index + 1;
            }
          }
        });
      });
      if (highest == -1) {
        highest = 0;
      }
      if (!courseOrder[highest]) {
        courseOrder[highest] = [];
      }
      courseOrder[highest].push(curr)
    }
    
    if (majors[0].name == "Data Science") {
      const courseMap = new Map();
      const allCourses = courses.concat(availableCourses);
      allCourses.forEach(course => courseMap.set(course.name, course));
      let newOrder = [];
      courseOrder = DATA_COURSE_ORDER;
      courseOrder.forEach(semester => {
        let arr = [];
        semester.forEach(course => {
          arr.push(courseMap.get(course));
        })
        newOrder.push(arr);
      });
      courseOrder = newOrder;
    }
    console.log(courseOrder);
    //TODO: uncomment this VV
    // setIsSaved(false);
    let availableCoursesCopy = [...availableCourses];
    let reorderedCourses = [...courses];

    courseOrder.forEach((semester, index) => {
      semester.forEach((course) => {
        if (!courses.some((c) => c.name === course.name)) {
          //This means the course is in the search bar
          let courseIndex = availableCoursesCopy.findIndex((c) => c.name == course.name);
          let courseToTransfer = availableCoursesCopy.splice(courseIndex, 1)[0];
          courseToTransfer.semester = semesters[index].semester;
          courseToTransfer.semesterIndex = index;
          reorderedCourses.push(courseToTransfer);
          console.log("Course", course)
          console.log("Index", index)
        }
        else {
          let reorderedCourses = [...courses];
          let courseIndex = reorderedCourses.findIndex((c) => c.name == course.name)
          console.log(reorderedCourses, courseIndex);
          console.log(reorderedCourses[courseIndex]);
          reorderedCourses[courseIndex].semester = semesters[index].semester;
          reorderedCourses[courseIndex].semesterIndex = index;
        }
      })
    });
    const updatedCourses = updatePrerequisiteErrors(reorderedCourses)
    setCourses(updatedCourses);
    setAvailableCourses(availableCoursesCopy);
  }

  const handleAutoSuggestClick = () => {
    if (isLoading) {
      return;
    }
    let coreCourses = aggregateCoreRequirementsIntoArray(majors);
    console.log("Core courses list: ", coreCourses);
    let topologicalCourses = sortCoursesForAutofillLowestDifficulty(coreCourses, courses.concat(availableCourses))
    // console.log("Core courses after topological sort: ", topologicalCourses);
    console.log("Core courses after topo sort2", topologicalCourses)
    let courseOrder = [[topologicalCourses[0]]];

    for (let i = 1; i < topologicalCourses.length; i++) {
      let curr = topologicalCourses[i];
      let highest = -1;
      //console.log("curr", curr)
      curr.prerequisites.forEach(prereqGroup => {
        // console.log("This prereq group has ", prereqGroup)
        courseOrder.forEach((s, index) => {
          //console.log("This semester has ", s);
          if (s.some(course => prereqGroup.includes(course.name))) {
            if (index > highest) {
              highest = index + 1;
            }
          }
        });
      });
      if (highest == -1) {
        highest = 0;
      }
      if (!courseOrder[highest]) {
        courseOrder[highest] = [];
      }
      courseOrder[highest].push(curr)
    }
    console.log("Collapsed courses", courseOrder);
    setIsSaved(false);
    let availableCoursesCopy = [...availableCourses];
    let reorderedCourses = [...courses];

    courseOrder.forEach((semester, index) => {
      semester.forEach((course) => {
        if (!courses.some((c) => c.name === course.name)) {
          //This means the course is in the search bar

          let courseIndex = availableCoursesCopy.findIndex((c) => c.name == course.name);
          let courseToTransfer = availableCoursesCopy.splice(courseIndex, 1)[0];
          courseToTransfer.semester = semesters[index].semester;
          courseToTransfer.semesterIndex = index;
          reorderedCourses.push(courseToTransfer);
        }
        else {
          let reorderedCourses = [...courses];
          let courseIndex = reorderedCourses.findIndex((c) => c.name == name)
          let courseToTransfer = reorderedCourses.splice(courseIndex, 1)[0];
          courseToTransfer.semester = semesters[index].semester;
          courseToTransfer.semesterIndex = index;
        }
      })
    });
    const updatedCourses = updatePrerequisiteErrors(reorderedCourses)
    //console.log(updatedCourses);
    setCourses(updatedCourses);
    setAvailableCourses(availableCoursesCopy);

  }


  if (isLoading) {
    return (
      <LoadingPage message="Loading Degree Planner..." />
    )
  }


  return (
    <div className="relative">
      <div
        className="relative grid gap-4 w-full bg-white dark:bg-gray-900 py-6 pr-20"
        style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
      >
        <div className="col-span-1 grid-rows-1 flex flex-col items-center pt-3 h-2/5 w-1/2 ml-6">
          <button
            className="p-2 cursor-pointer"
            onClick={handleCreatePDF}
            title="Save as PDF"
          >
            <FileDown className="text-gray-300 h-8 w-8" />
          </button>
          <div className="my-0.5 h-0.25 w-3/5 bg-gray-400" />

          <button className="p-2 cursor-pointer" onClick={handleSaveClick}>
            <Save className="text-gray-300 h-8 w-8" />
          </button>
          <div className="my-0.5 h-0.25 w-3/5 bg-gray-400" />

          <button className="p-2 cursor-pointer" onClick={handleAutoFillClick}>
            <CalendarSync className="text-gray-300 h-8 w-8" />
          </button>
          <div className="my-0.5 h-0.25 w-3/5 bg-gray-400" />

          <button className="p-2 cursor-pointer" onClick={handleAutoSuggestClick}>
            <CalendarHeart className="text-gray-300 h-8 w-8" />
          </button>
          <div className="my-0.5 h-0.25 w-3/5 bg-gray-400" />
          <button className="p-2 cursor-pointer" onClick={handleSettingsClick}>
            <Settings2 className="text-gray-300 h-8 w-8" />
          </button>
          <div className="my-0.5 h-0.25 w-3/5 bg-gray-400" />
          <button className="p-2 cursor-pointer" onClick={handleReportClick}>
            <Flag className="text-gray-300 h-8 w-8" />
          </button>
        </div>

        <div className="col-span-11 grid grid-cols-4 grid-rows-2 gap-4 grid-flow-col">
          {semesters.map((s) => {
            return (
              <Semester
                key={s.semesterIndex}
                semester={s.semester}
                semesterIndex={s.semesterIndex}
                id={s.semesterIndex}
                courses={courses}
                setCourses={setCourses}
                errors={errors}
                setErrors={setErrors}
                setSemesters={setSemesters}
                allSemesters={semesters}
                semesterCourses={s.courses}
                availableCourses={availableCourses}
                setAvailableCourses={setAvailableCourses}
                setIsSaved={setIsSaved}
                semesterDisplayState={semesterDisplayState}
                setsemesterDisplayState={setsemesterDisplayState}
              />
            );
          })}
        </div>

        <div className="col-span-4 space-y-6" style={{ height: "90vh" }}>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 h-full">
            {/* <div className="text-gray-400 flex gap-2">
              Only Search Favorited Courses?
              <input type="checkbox" checked={showFavorited} onChange={() => setShowFavorited(!showFavorited)} />
            </div> */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div
              className="relative mt-2 space-y-2 h-1/2"
              onDragOver={handleDragOver}
              onDrop={handleDragEnd}
              onDragLeave={handleDragLeave}
            >
              {searchFilteredCourses.length > 0 && (
                <div className="mt-2 h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto searchContainer">
                  {searchFilteredCourses.map((c) => (
                    <Course key={c.courseID} handleDragStart={handleDragStart} course={c} />
                  ))}
                </div>
              )}
              {active && (
                <div className="top-0 absolute z-10 w-full h-full bg-red-100/20 dark:bg-red-900/20 backdrop-blur-lg rounded-lg border dark:border-red-500 border-red-300">
                  <Trash className="dark:text-red-400 text-red-600 h-20 w-20 m-auto mt-24" />
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {(errors.length > 0) && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 overflow-y-auto errorContainer"
                  style={{
                    height: "33vh",
                  }}
                >
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <h3 className="font-medium">Errors found</h3>
                  </div>
                  {getErrorMessages().map((error, index) => (
                    <div key={index}>
                      <p className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                      <br></br>
                    </div>
                  ))}
                  {
                    missingRequirements.map((r, index) => (
                      <p
                        key={index}
                        className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 underline cursor-pointer mt-2"
                        onClick={() => handleErrorClick(r)}
                      >
                        {"Missing requirement: " + r.name + " (" + r.courses.map(group => group.join(" OR ")).join(" AND ") + ")"}
                      </p>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster
        toastOptions={{
          className: '',
          style: {
            padding: '16px',
            color: '#fefefe',
            backgroundColor: '#1f2937'
          },
        }}
      />
      {isPopupVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closePopup}
        >
          <div
            className="bg-white dark:bg-gray-800/50 p-6 rounded-lg shadow-lg p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {(popupState == "Save") &&
              <SaveDegreeForm handleSaveDegreePlan={handleSaveDegreePlan} />
            }
            {(popupState == "Settings") &&
              <DegreePlannersettingsForm
                user={user}
                majors={majors}
                setMajors={setMajors}
                setIsPopupVisible={setIsPopupVisible}
              />
            }
            {(popupState == "Report") && 
              <ReportForm 
                handleReportFormSubmit={handleReportFormSubmit}
                closePopup={closePopup}
              />
            }
          </div>
        </div>
      )}
    </div>
  );
}

const Course = ({ course, handleDragStart }) => {
  const { name, semester, conflicts, suggested } = course;
  const [hovered, setHovered] = useState(false);
  const handleMouseOver = (e) => {
    setHovered(true);
  }
  const handleMouseOut = (e) => {

    setHovered(false);
  }
  function handleInfoClicked(e) {
    window.alert("Course info clicked");
  }

  const getConflictMessage = () => {
    if (conflicts.length == 0) {
      return null;
    }
    else {
      let inlineError = conflicts.map(group => `(${group.join(" OR ")})`).join(" AND ");
      return inlineError;
    }
  };

  return (
    <>
      <DropIndicator beforeId={name} semester={semester} />
      <div
        draggable="true"
        onDragStart={(e) => {
          handleDragStart(e, { name, semester })
          handleMouseOut();
        }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseOut={(e) => handleMouseOut(e)}
        className={(course.conflicts.length > 0 ? `bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-200` : `dark:border-gray-600 dark:bg-gray-800`) + " relative cursor-grab rounded border p-2 active:cursor-grabbing"}
      >
        <p className={(course.conflicts.length > 0) ? `text-sm font-semibold text-red-800 dark:text-red-200` : `text-sm text-gray-800 dark:text-white font-semibold`}>{name}</p>
        <p className={(course.conflicts.length > 0) ? `text-xs text-red-700 dark:text-red-300` : `text-xs text-gray-600 dark:text-gray-400`}>
          {
            (course.conflicts.length == 0) ? course.description : "Prerequisite " + getConflictMessage()
          }
        </p>
         {(suggested && semester < 1) && (
          <Star className="absolute top-5 right-4 cursor-pointer w-3 h-3 text-gray-400" />
        )}
      </div>
    </>
  );
};

const DropIndicator = ({ beforeId, semester }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-semester={semester}
      className="my-0.5 h-0.5 w-full bg-gray-400 opacity-0"
    />
  );
};

function Semester({ semester, semesterIndex, courses, setCourses, errors, setErrors, semesterDisplayState, setsemesterDisplayState, allSemesters, availableCourses, setAvailableCourses, setIsSaved }) {
  let semesterToUpdate = allSemesters.find((s) => s.semester === semester)

  const [active, setActive] = useState(false);
  const [creditHours, setCreditHours] = useState(0);

  const handleDragStart = (e, course) => {
    e.dataTransfer.setData("name", course.name);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDisplayClicked = () => {
    if (semesterDisplayState == "Hours") {
      setsemesterDisplayState("Difficulty");
    }
    else {
      setsemesterDisplayState("Hours");
    }
  }

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-semester="${semester}"]`));
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const checkPrerequisites = (course, courses) => {
    const filteredCourses = courses.filter((c) => c.semesterIndex < course.semesterIndex);
    const filteredname = new Set(filteredCourses.map(c => c.name));

    // Find all prerequisite groups that are not fulfilled
    const unfulfilledPrereqGroups = course.prerequisites.filter(prereqGroup =>
      !prereqGroup.some(prereq => filteredname.has(prereq))
    );
    return unfulfilledPrereqGroups;
  }

  const updatePrerequisiteErrors = (reorderedCourses) => {
    const updatedCourses = reorderedCourses.map((course) => {
      const conflicts = checkPrerequisites(course, reorderedCourses);
      return { ...course, conflicts }; // Update the conflicts field
    });
    const updatedErrors = errors.filter((err) => err.errorType !== "prerequisite_conflict");
    updatedCourses.forEach((course) => {
      if (course.semesterIndex == -1) {
        return;
      }
      if (course.conflicts.length > 0) {
        updatedErrors.push({
          errorType: "prerequisite_conflict",
          clickAction: "search_prerequisites",
          prerequisites: course.conflicts,
          course: course.name,
          semester: course.semester,
        });
      }
    });
    setErrors(updatedErrors);
    return updatedCourses;
  }

  useEffect(() => {
    INITIAL_SEMESTERS.forEach(s => {
      const filteredCourses = courses.filter((c) => (c.semester == s.semester));

      const totalCreditHours = filteredCourses.reduce((total, course) => {
        return total + course.creditHours;
      }, 0);

      setErrors(prevErrors => {
        const hasError = prevErrors.some(e => e.errorType === "not_enough_hours" && e.semester === s.semester);

        if (totalCreditHours < 12) {
          if (!hasError) {
            return [
              ...prevErrors,
              {
                errorType: "not_enough_hours",
                clickAction: "",
                course: "",
                semester: s.semester
              }
            ];
          }
        } else {
          if (hasError) {
            return prevErrors.filter(e => !(e.errorType === "not_enough_hours" && e.semester === s.semester));
          }
        }

        return prevErrors; // No changes
      });
    });
  }, [courses]);


  const getCreditHourDisplayColors = (hours) => {
    let str = "text-sm "
    if (hours == 0) {
      return str + "text-gray-500";
    }
    else if (hours < 12) {
      return str + "text-red-300";
    }
    else if (hours > 18) {
      return str + "text-yellow-500";
    }
    else {
      return str + "text-gray-200"
    }
  }

  const getDifficultyDisplayColors = (difficulty) => {
    let str = "text-sm "
    if (difficulty == "~") {
      return str + "text-gray-500";
    }
    else {
      difficulty = parseFloat(difficulty);
      if (difficulty < 2.5) {
        return str + "text-green-300";
      }
      else if (difficulty < 3.5) {
        return str + "text-yellow-300";
      }
      else if (difficulty < 4.5) {
        return str + "text-orange-300";
      }
      else {
        return str + "text-red-300";
      }
    }
  }

  const handleDragEnd = (e) => {
    const name = e.dataTransfer.getData("name");

    setActive(false);
    clearHighlights();
    const before = getNearestIndicator(e, getIndicators()).element.dataset.before || "-1";
    if (!courses.some((c) => c.name === name)) {
      setIsSaved(false);
      //This means the course is in the search bar
      let availableCoursesCopy = [...availableCourses];
      let reorderedCourses = [...courses];
      let courseIndex = availableCoursesCopy.findIndex((c) => c.name == name);
      let courseToTransfer = availableCoursesCopy.splice(courseIndex, 1)[0];
      courseToTransfer.semester = semester;
      courseToTransfer.semesterIndex = semesterIndex;
      if (before == "-1") {
        //goes at the very end
        reorderedCourses.push(courseToTransfer);
      }
      else {
        const targetIndex = (courses.findIndex((c) => c.name == before));
        reorderedCourses.splice(targetIndex, 0, courseToTransfer);
      }
      const updatedCourses = updatePrerequisiteErrors(reorderedCourses)
      setCourses(updatedCourses);
      setAvailableCourses(availableCoursesCopy)
    }
    else {
      if (before !== name) {
        setIsSaved(false);
        let reorderedCourses = [...courses];
        let courseIndex = reorderedCourses.findIndex((c) => c.name == name)
        let courseToTransfer = reorderedCourses.splice(courseIndex, 1)[0];
        courseToTransfer.semester = semester;
        courseToTransfer.semesterIndex = semesterIndex;
        if (before == "-1") {
          //goes at the very end
          reorderedCourses.push(courseToTransfer);
        }
        else {
          const targetIndex = (reorderedCourses.findIndex((c) => c.name == before));
          reorderedCourses.splice(targetIndex, 0, courseToTransfer);
        }


        setCourses(updatePrerequisiteErrors(reorderedCourses));
      }
    }
  }

  const filteredCourses = courses.filter((c) => (c.semester == semester));
  const totalCreditHours = filteredCourses.reduce((total, course) => {
    return total + course.creditHours
  }, 0);
  const coursesWithReviews = filteredCourses.filter((c) => (c.numReviews > 0));
  const totalDifficulty = coursesWithReviews.reduce((total, course) => {
    return total + course.difficulty
  }, 0);
  const displayedDifficulty = (coursesWithReviews.length == 0) ? "~" : (totalDifficulty/coursesWithReviews.length).toFixed(2);



  return (
    <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{semester}</h3>
        <button className="cursor-pointer" onClick={handleDisplayClicked}>
          {
            (semesterDisplayState == "Hours") &&
            <span className={getCreditHourDisplayColors(totalCreditHours)}>
            {totalCreditHours + " hrs"}
            </span>
          }
          {
            (semesterDisplayState == "Difficulty") &&
            <span className={getDifficultyDisplayColors(displayedDifficulty)}>
            {displayedDifficulty}
            </span>
          }
        </button>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="h-full w-full"
      >
        {filteredCourses.map((c) => {
          return <Course key={c.courseID} handleDragStart={handleDragStart} course={c} />;
        })}
        <DropIndicator beforeId={null} semester={semester} />
      </div>
    </div>
  );
}
