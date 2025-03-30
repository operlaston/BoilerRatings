import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Search, AlertCircle, Info, Trash, FileDown, Save, CalendarSync, Settings2 } from "lucide-react";
import "../styles/App.css"
import { getCourses } from "../services/course.service";
import { createDegreePlan, getMajorById } from "../services/degreeplan.service";
import SaveDegreeForm from "../components/SaveDegreeForm";
import DegreePlannersettingsForm from "../components/DegreePlannerSettingsForm";

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

const INITIAL_ERRORS = [
]

const DEGREE_REQUIREMENTS = [
  {
    type: "core",
    name: "Core CS",
    courses: [["MA 261"], ["MA 265"], ["CS 180"], ["CS 182"], ["CS 240"], ["CS 250"], ["CS 252"], ["CS 251"]],
    numberOfCoursesRequired: -1,
    numberOfCreditsRequired: -1,
  },
  {
    type: "core",
    name: "SWE core",
    courses: [["CS 307"], ["CS 352", "CS 354"], ["CS 381"], ["CS 408"], ["CS 407"]],
    numberOfCoursesRequired: -1,
    numberOfCreditsRequired: -1,
  },
  {
    type: "core",
    name: "SWE elective",
    courses: [["CS 311", "CS 411"], ["CS 348"], ["CS 351"], ["CS 352"], ["CS 353"], ["CS 354"], ["CS 373"], ["CS 422"], ["CS 426"], ["CS 448"], ["CS 456"], ["CS 473"], ["CS 489"], ["CS 490-DSO"], ["CS 490-SWS"], ["CS 510"], ["CS 590-SRS"]],
    numberOfCoursesRequired: 1,
    numberOfCreditsRequired: -1,
  },

]

export default function DegreePlanner({ user, setUser, degreePlan }) {
  const [semesters, setSemesters] = useState(INITIAL_SEMESTERS)
  const [availableCourses, setAvailableCourses] = useState([])
  const [courses, setCourses] = useState([]); // Initial courses state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [errors, setErrors] = useState(INITIAL_ERRORS); // Errors state
  const [active, setActive] = useState(false);
  const [missingRequirements, setMissingRequirements] = useState([]);
  const [isSaved, setIsSaved] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupState, setPopupState] = useState("Save");
  const [degreePlanName, setDegreePlanName] = useState("My Degree Plan");
  const [major, setMajor] = useState("");

  const fetchCourses = async () => { //Fetch courses from database
    try {
      console.log("Getting courses")
      const courses = await getCourses();
      const availableCourses = courses.map((course) => ({
        courseID: course.id,
        name: course.number,
        semester: "",
        semesterIndex: -1,
        description: course.name,
        creditHours: course.creditHours,
        prerequisites: course.prerequisites,
        corequisites: [],
        conflicts: []
      }));//.filter(course => course.prerequisites.length > 0);
      console.log(availableCourses);
      if (!user) {
        const savedData = localStorage.getItem("degreeData");
        if (savedData) {
          const updatedCourses = JSON.parse(savedData);
          const savedCourseIDs = updatedCourses.map(course => course.courseID);
          const updatedAvailableCourses = availableCourses.filter(course => !savedCourseIDs.includes(course.courseID));
          setCourses(updatePrerequisiteErrors(updatedCourses));
          setAvailableCourses(updatedAvailableCourses);
          return;
        }
      }
      if (degreePlan) {
        const getCourses = degreePlan.savedCourses;
        const savedCourseIDs = degreePlan.savedCourses.map(course => course.course.id);
        const updatedAvailableCourses = availableCourses.filter(course => !savedCourseIDs.includes(course.course));

        const updatedCourses = getCourses.map((course) => {
          return {
            courseID: course.course.id,
            name: course.course.number,
            semester: course.semester,
            semesterIndex: course.semesterIndex,
            description: course.course.name,
            creditHours: course.course.creditHours,
            prerequisites: course.course.prerequisites,
            corequisites: [],
            conflicts: []
          };
        });
        setCourses(updatePrerequisiteErrors(updatedCourses))
        setAvailableCourses(updatedAvailableCourses)
      } else {
        setCourses([]);
        setAvailableCourses(availableCourses);
      }
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  }
  const fetchMajor = async () => {
    try {
      console.log("Getting user's major")
      let majorIds = user.major;
      const promises = [];
      for (const id of majorIds) {
        promises.push(getMajorById(id));
      }
      const userMajorObjects = await Promise.all(promises);

      console.log(userMajorObjects);
    } catch (error) {
      console.log("Error fetching major", error);
    }
  }
  useEffect(() => {// Fetch courses on load
    fetchCourses();
    if (user) {
      fetchMajor(user);
    }
  }, []);
  const filteredCourses = availableCourses //Filter courses to show in search bar
    .filter((course) => {
      const normalizedCourseName = course.name.replace(/\s+/g, '').toLowerCase();

      const searchTerms = searchQuery.split('AND').map(term => term.trim().toLowerCase());

      return searchTerms.some(term => {
        const normalizedTerm = term.replace(/\s+/g, '').toLowerCase();
        return normalizedCourseName.includes(normalizedTerm);
      });
    }).slice(0, 20)
  const closePopup = () => {
    setIsPopupVisible(false);
  };
  const handleSettingsClick = () => {
    setPopupState("Settings");
    setIsPopupVisible(true);
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
    if (!user) {
      localStorage.setItem("degreeData", JSON.stringify(courses));
      window.alert("Degree plan saved to local storage");
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
    console.log("Degree Plan saved as:", degreePlanName);
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
    DEGREE_REQUIREMENTS.forEach(requirement => {
      let missingRequirement = {
        name: requirement.name,
        courses: []
      };
      requirement.courses.forEach(group => {
        if (!group.some(course => courses.some(c => c.name === course))) {
          missingRequirement.courses.push(group);
        }
      });
      if (missingRequirement.courses.length > 0) {
        arr.push(missingRequirement);
      }
    });
    setMissingRequirements(arr);
  }, [courses]);
  const handleErrorClick = (requirement) => {
    setSearchQuery(requirement.courses.map(group => group.join(" AND ")).join(" AND "));
  }

  // Generate the PDF
  const handleCreatePDF = () => {
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
    let topologicalCourses = (sortCoursesForAutofill(["MA 16100", "MA 16200", "MA 16600", "MA 26100", "CS 18000", "CS 25200", "CS 18200", "CS 24000", "CS 25000" , "CS 25100"], courses.concat(availableCourses)));
    let courseOrder = [[topologicalCourses[0]]];
    
    for (let i = 1; i < topologicalCourses.length; i++) {
      let curr = topologicalCourses[i];
      let highest = -1;
      curr.prerequisites.forEach(prereqGroup => {
        console.log("This prereq group has ", prereqGroup)
        courseOrder.forEach((s, index) => {
          console.log("This semester has ", s);
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




    //TODO: uncommend this VV





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
    console.log(updatedCourses);
    setCourses(updatedCourses);
    setAvailableCourses(availableCoursesCopy);
  }
  function sortCoursesForAutofill(coreCourses, allCourses) {
    const coursePrereqMap = {};
    const coreSet = new Set(coreCourses);
    const courseMap = new Map();
    allCourses.forEach(course => courseMap.set(course.name, course));
    const missingPrereqs = new Set();

    console.log(coreCourses);
    console.log(allCourses);
    // First, build a map of all core courses with their filtered prerequisites
    allCourses.forEach(course => {
      if (coreSet.has(course.name)) {
        // Process all prerequisites without filtering for coreSet
        const filteredPrereqs = (course.prerequisites || []).map(prereqGroup =>
          prereqGroup.map(prereq => {
            // Track missing prerequisites if they are not in the coreSet
            if (!coreSet.has(prereq)) {
              missingPrereqs.add(prereq);
            }
            return prereq;
          })
        );
    
        console.log("FilteredPreqs", filteredPrereqs);
        coursePrereqMap[course.name] = filteredPrereqs;
      }
    });
    console.log("Course Prereq Map", coursePrereqMap);
    console.log("New prereq",missingPrereqs)
    missingPrereqs.forEach(prereq => {
      if (courseMap.has(prereq)) {
          coreCourses.push(prereq);
          coreSet.add(prereq);
          coursePrereqMap[prereq] = (courseMap.get(prereq).prerequisites || []).map(prereqGroup =>
            prereqGroup.filter(p => courseMap.has(p))
        );
      }
  });
  console.log("Course Prereq Map", coursePrereqMap);
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
    console.log(allSortedCourses)
    allSortedCourses.forEach(courseName => {
      if (!visited.has(courseName)) {
          visit(courseName);
      }
  });

    return (result);
  }


  return (
    <div className="relative">
      <div
        className="relative grid gap-4 w-full bg-white dark:bg-gray-900 py-6 pr-20"
        style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
      >
        <div className="col-span-1 grid-rows-1 flex flex-col items-center pt-3 h-1/3 w-3/4 ml-4 bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700 ">
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

          <button className="p-2 cursor-pointer" onClick={handleSettingsClick}>
            <Settings2 className="text-gray-300 h-8 w-8" />
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
              />
            );
          })}
        </div>

        <div className="col-span-4 space-y-6" style={{ height: "90vh" }}>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 h-full">
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
              className="relative mt-2 space-y-2 h-2/3"
              onDragOver={handleDragOver}
              onDrop={handleDragEnd}
              onDragLeave={handleDragLeave}
            >
              {filteredCourses.length > 0 && (
                <div className="mt-2 h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-y-auto searchContainer">
                  {filteredCourses.map((c) => (
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
                    height: "23vh",
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
                        className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300 underline cursor-pointer"
                        onClick={() => handleErrorClick(r)}
                      >
                        {"You must take " + r.name + " (" + r.courses.map(group => group.join(" OR ")).join(" AND ") + ")"}
                      </p>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
              <DegreePlannersettingsForm />
            }
          </div>
        </div>
      )}
    </div>
  );
}

const Course = ({ course, handleDragStart }) => {
  const { name, semester, conflicts } = course;
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
        {/* {hovered && (
          <button
            className={`absolute top-4 right-4 cursor-pointer w-6 h-6`}
            onClick={(e) => handleInfoClicked(e)}
          >
            <Info className="text-gray-400 hover:text-gray-200" />
          </button>
        )} */}
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

function Semester({ semester, semesterIndex, courses, setCourses, errors, setErrors, setSemesters, allSemesters, availableCourses, setAvailableCourses, setIsSaved }) {
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



  return (
    <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{semester}</h3>
        <span className={getCreditHourDisplayColors(totalCreditHours)}>
          {totalCreditHours + " hrs"}
        </span>
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
