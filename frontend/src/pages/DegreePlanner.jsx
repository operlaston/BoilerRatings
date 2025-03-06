import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { Search, AlertCircle, Info, Trash } from "lucide-react";
import { getCourses } from "../services/courses";
import { createDegreePlan } from "../services/degreePlan";

//Need to set INITIAL_CLASSES to all classes in the data base
//const INITIAL_CLASSES = await getCourses()

const INITIAL_CLASSES= [
  {
	courseID: 0,
	name: "CS 180",
	semester: "",

	semesterIndex: 4,
	description: "Intro to OOP",
	creditHours: 4,
	prerequisites: [],
	corequisites: [],
	conflicts: [],
  },
  {
	courseID: 1,
	name: "CS 240",
	semester: "",

	semesterIndex: 5,
	description: "Programming in C",
	creditHours: 3,
	prerequisites: [["CS 180"]],
	corequisites: [],
	conflicts: [],
  },
  {
	courseID: 2,
	name: "CS 252",
	semester: "",

	semesterIndex: 5,
	description: "Systems programming",
	creditHours: 4,
	prerequisites: [["CS 250"], ["CS 251"]],
	corequisites: [],
	conflicts: [],

  },
  {
	courseID: 3,
	name: "CS 250",
	semester: "",
	semesterIndex: 5,
	description: "Computer architecture",
	creditHours: 4,
	prerequisites: [["CS 240"], ["CS 182"]],
	corequisites: [],
	conflicts: [],

  },
]

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
  // {
  //   errorType: "class_is_missing",
  //   errorMessage: "You need to take CS250!",
  //   clickAction: "search_class_name",
  //   course: "CS 250", 
  //   semester: ""
  // },
  {
    errorType: "not_enough_hours",
    clickAction: "",
    course: "",
    semester: "Spring 2024"
  }
]

const DEGREE_REQUIREMENTS = [
  {
    type: "core",
    name: "Core CS",
    courses: [["CS 180"], ["CS 182"], ["CS 240"], ["CS 250"], ["CS 251"], ["CS 252"], ["MA 261"], ["MA 265"]],
    numberOfCoursesRequired: -1,
    numberOfCreditsRequired: -1,
  },
  {
    type: "core",
    name: "Software engineering",
    courses: [["CS 307"]]
  }
]

const INITIAL_AVAILABLE_COURSES = [
  {
    courseID: 4,
    name: "CS 251",
    semester: "",
    semesterIndex: -1,
    description: "Data structures and algorithms",
    creditHours: 3,
    prerequisites: [["CS 240"], ["CS 182"]],
    conflicts: [],
  
    },
    {
    courseID: 5,
    name: "CS 193",
    semester: "",
    semesterIndex: -1,
    description: "Tools",
    creditHours: 1,
    prerequisites: [],
    conflicts: [],
  
   },
   {
    courseID: 6,
    name: "CS 182",
    semester: "",
    semesterIndex: -1,
    description: "Foundations of Computer Science",
    creditHours: 3,
    prerequisites: [["CS 180"], ["MA 161"]],
    conflicts: [],
  
    },
    {
    courseID: 7,
    name: "MA 161",
    semester: "",
    semesterIndex: -1,
    description: "Calculus I",
    creditHours: 5,
    prerequisites: [],
    conflicts: [],
  
    },
    {
    courseID: 8,
    name: "MA 162",
    semester: "",
    semesterIndex: -1,
    description: "Calculus II",
    creditHours: 5,
    prerequisites: [["MA 161"]],
    conflicts: [],
  
    },
    {
    courseID: 9,
    name: "MA 261",
    semester: "",
    semesterIndex: -1,
    description: "Multivariate Calculus",
    creditHours: 4,
    prerequisites: [["MA 162"]],
    conflicts: [],
  
    },
    {
    courseID: 10,
    name: "MA 265",
    semester: "",
    semesterIndex: -1,
    description: "Linear Algebra",
    creditHours: 3,
    prerequisites: [["MA 162"]],
    conflicts: [],
  
    },
    {
    courseID: 11,
    name: "STAT 350",
    semester: "",
    semesterIndex: -1,
    description: "Introduction to Statistics",
    creditHours: 3,
    prerequisites: [["MA 162"]],
    conflicts: [],
    },
];

export default function DegreePlanner({user, setUser, degreePlan}) {
  const [semesters, setSemesters] = useState(INITIAL_SEMESTERS)
  const [availableCourses, setAvailableCourses] = useState(INITIAL_AVAILABLE_COURSES)
  const [courses, setCourses] = useState(INITIAL_CLASSES); // Initial courses state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [errors, setErrors] = useState(INITIAL_ERRORS); // Errors state
  const [degreePlanName, setDegreePlanName] = useState(""); // Degree plan name state
  const [active, setActive] = useState(false);
  const fetchCourses = async () => {
    try {
      const courses = await getCourses();
      setCourses(courses);
      setAvailableCourses(courses);
    } catch (error) {
      console.log("Error fetching courses");
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);
  if (degreePlan) {
    setSemesters(degreePlan.savedCourses);
  }

  // Filter courses based on the search query
  const filteredCourses = availableCourses.filter((course) =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (e, course) => {
    console.log('Dragging course:', course); // Add this for debugging
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
      setCourses(currentCourses);
    }
    setActive(false);
  }

  // Handle saving the degree plan
  const handleSaveDegreePlan = () => {
    if (degreePlanName.trim() === "") {
      alert("Please provide a name for the degree plan.");
      return;
    }
    if (!user) {
      alert("Please log in to save");
      return;
    }
    console.log("Degree Plan saved as:", degreePlanName);
    console.log(user, degreePlanName, semesters)
    createDegreePlan(user, degreePlanName, semesters)
  };

  // Generate the PDF
  const handleCreatePDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "normal");

    // Add the title
    doc.text("Degree Plan: " + degreePlanName, 10, 10);

    // Add semester courses
    semesters.forEach((semester, index) => {
      const semesterTitle = `Semester ${semester.semesterIndex + 1}`;
      doc.text(semesterTitle, 10, 20 + index * 10); // Adjust spacing dynamically

      semester.courses.forEach((course, courseIndex) => {
        const courseText = `${course.name}`;
        doc.text(courseText, 10, 30 + index * 10 + courseIndex * 10); // Adjust spacing dynamically
      });
    });

    // Save the PDF
    doc.save(`${degreePlanName}_DegreePlan.pdf`);
  };

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
        return err.prerequisites.map(group => `(${group.join(" OR ")})`) .join(" AND ") + " before " + err.course; 
      })
      .join(", ")
      formattedErrorArray.push(PREREQUISITE_CONFLICT);
    }
    return formattedErrorArray;
  }

  return (
    <div className="grid grid-cols-12 gap-6 w-full h-full min-h-screen bg-white dark:bg-gray-900 py-6 px-20">
      <div className="col-span-9 grid grid-cols-4 grid-rows-2 gap-4 grid-flow-col">
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
            />
          );
        })}
      </div>

      <div 
        className="col-span-3 space-y-6"
      >
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
            className="relative mt-2 space-y-2 h-1/2"
            onDragOver={handleDragOver}
            onDrop={handleDragEnd}
            onDragLeave={handleDragLeave}
          >
            {filteredCourses.length > 0 && (
              <div className="mt-2 h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 overflow-y-scroll">
                {filteredCourses.map((c) => (
                  // <p
                  //   key={index}
                  //   className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  //   draggable
                  //   onDragStart={(e) => handleDragStart(e, course)}
                  // >
                  //   {course.name}
                  // </p>
                  <Course key={c.courseID} handleDragStart={handleDragStart} course={c}/>
                ))}
              </div>
            )}
            { active && (
              <div className="top-0 absolute z-10 w-full h-full bg-red-100/20 dark:bg-red-900/20 backdrop-blur-lg rounded-lg border dark:border-red-500 border-red-300">
                <Trash className="dark:text-red-400 text-red-600 h-20 w-20 m-auto mt-24"/>
              </div>
            )}
          </div>
          {/* Degree Plan Name Input */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter degree plan name..."
              value={degreePlanName}
              onChange={(e) => setDegreePlanName(e.target.value)}
              className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Save and Create PDF Buttons */}
          <div className="mt-4 space-y-4">
            <button
              onClick={handleSaveDegreePlan}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              Save Degree Plan
            </button>
            <button
              onClick={handleCreatePDF}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            >
              Create PDF
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {errors.length > 0 && (
              <div className=" bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800 overflow-y-scroll">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">Errors found</h3>
                </div>
                {getErrorMessages().map((error, index) => (
                  <p key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


//add a SETERROR method and pass it in 
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
      let inlineError = conflicts.map(group => `(${group.join(" OR ")})`) .join(" AND "); 
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
        className={(course.conflicts.length > 0 ?`bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-200` : `dark:border-gray-600 dark:bg-gray-800`) +  " relative cursor-grab rounded border p-3 active:cursor-grabbing"}
      >
        <p className={ (course.conflicts.length > 0) ? `text-sm font-semibold text-red-800 dark:text-red-200` : `text-sm text-gray-800 dark:text-white font-semibold` }>{name}</p>
        <p className= { (course.conflicts.length > 0) ? `text-sm text-red-700 dark:text-red-300` : `text-sm text-gray-600 dark:text-gray-400`}>
          {
            (course.conflicts.length == 0) ? course.description : "Prerequisite " + getConflictMessage()
          }
        </p>
        { hovered && (
          <button 
            className={`absolute top-5 right-4 cursor-pointer w-6 h-6`}
            onClick={(e) => handleInfoClicked(e)}
          >
            <Info className="text-gray-400 hover:text-gray-200" />
          </button>
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


function Semester({ semester, semesterIndex, courses, setCourses, errors, setErrors, setSemesters, allSemesters, availableCourses, setAvailableCourses }) {
  let semesterToUpdate = allSemesters.find((s) => s.semester === semester)
  
  const [active, setActive] = useState(false);
  const [creditHours, setCreditHours] = useState(0);

  useEffect(() => {
    updateErrors(courses);
  }, [])

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
    const filteredCourseName = new Set(filteredCourses.map(c => c.name));

    // Find all prerequisite groups that are not fulfilled
    const unfulfilledPrereqGroups = course.prerequisites.filter(prereqGroup =>
      !prereqGroup.some(prereq => filteredCourseName.has(prereq))
    );
    return unfulfilledPrereqGroups;
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

  const updateErrors = (reorderedCourses) => {
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
      console.log(updatedCourses);
      setErrors(updatedErrors);
      return updatedCourses;
  }

  const handleDragEnd = (e) => {
    const name = e.dataTransfer.getData("name");

    setActive(false);
    clearHighlights();
    const before = getNearestIndicator(e, getIndicators()).element.dataset.before || "-1";

    if (!courses.some((c) => c.name === name)) {
      //This means the course is in the search bar
      let availableCoursesCopy = [...availableCourses];
      let reorderedCourses = [...courses];
      let courseIndex = availableCoursesCopy.findIndex((c) => c.name == name)
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
      const updatedCourses = updateErrors(reorderedCourses)
      setCourses(updatedCourses);
      semesterToUpdate.courses = updatedCourses.filter((c) => c.semester == semester)
      setSemesters([...allSemesters])
      setAvailableCourses(availableCoursesCopy)
    }
    else {
      if (before !== name) {
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
        
        setCourses(updateErrors(reorderedCourses));
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
        <h3 className= "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{semester}</h3>
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
          return <Course key={c.courseID} handleDragStart={handleDragStart} course={c}/>;
        })}
        <DropIndicator beforeId={null} semester={semester} />
      </div>
    </div>
  );
}
