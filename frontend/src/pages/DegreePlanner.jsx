import { useState } from "react";
import { Search, AlertCircle, Info } from "lucide-react";

const INITIAL_CLASSES= [
  {
    courseID: 0,
    courseAlias: "CS 180", 
    semester: "Fall 2025",

    semesterIndex: 4, 
    description: "Intro to OOP",
    creditHours: 4,
    prerequisites: [], 
    corequisites: [],
  }, 
  {
    courseID: 1,
    courseAlias: "CS 240", 
    semester: "Spring 2026", 

    semesterIndex: 5,
    description: "Programming in C",
    creditHours: 4,
    prerequisites: [["CS 180"]], 
    corequisites: [],
  }, 
  {
    courseID: 2,
    courseAlias: "CS 252", 
    semester: "Spring 2026", 

    semesterIndex: 5,
    description: "Systems programming",
    creditHours: 3,
    prerequisites: [["CS 240"], ["CS 180"]], 
    corequisites: [],
  }, 
]

const INITIAL_SEMESTERS = [
  {
    semester: "Fall 2023",
    semesterIndex: 0, 
  }, 
  {
    semester: "Spring 2024", 
    semesterIndex: 1, 
  }, 
  {
    semester: "Fall 2024", 
    semesterIndex: 2, 
  }, 
  {
    semester: "Spring 2025",
    semesterIndex: 3,  
  }, 
  {
    semester: "Fall 2025",
    semesterIndex: 4,  
  }, 
  {
    semester: "Spring 2026",
    semesterIndex: 5,  
  }, 
  {
    semester: "Fall 2026",
    semesterIndex: 6,  
  }, 
  {
    semester: "Spring 2027",
    semesterIndex: 7,  
  }, 
]

const INITIAL_ERRORS = [
  {
    errorType: "class_is_missing",
    errorMessage: "You need to take CS250!",
    clickAction: "search_class_name",
    course: "CS 250", 
    semester: ""
  },
  {
    errorType: "not_enough_hours",
    errorMessage: "Not enough hours in Spring 2024!",
    clickAction: "",
    course: "",
    semester: "Spring 2024"
  }
]

export default function DegreePlanner() {

  // Define available courses within the function

  const availableCourses = [
    { courseAlias: "CS 180" },
    { courseAlias: "CS 193" },
    { courseAlias: "CS 240" },
    { courseAlias: "CS 250" },
    { courseAlias: "CS 251" },
    { courseAlias: "CS 252" },
    { courseAlias: "MA 161" },
    { courseAlias: "MA 162" },
    { courseAlias: "MA 261" },
    { courseAlias: "MA 265" },
    { courseAlias: "STAT 350" },
  ];


  const [courses, setCourses] = useState(INITIAL_CLASSES); // Initial courses state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [errors, setErrors] = useState(INITIAL_ERRORS); // Errors state

  // Filter courses based on the search query
  const filteredCourses = availableCourses.filter((course) =>
    course.courseAlias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the drag start event
  const handleDragStart = (e, course) => {
    e.dataTransfer.setData("courseAlias", course.courseAlias); // Set the courseAlias in dataTransfer
  };

  return (
    <div className="grid grid-cols-12 gap-6 w-full h-full min-h-screen bg-white dark:bg-gray-900 py-6 px-20">
      <div className="col-span-9 grid grid-cols-4 grid-rows-2 gap-4 grid-flow-col">
        {
          INITIAL_SEMESTERS.map((s) => {
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
              />
            );
          })
        }
      </div>

      <div className="col-span-3 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 h-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
              className="w-full pl-10 p-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent transition-all outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="mt-4 space-y-2">
            {filteredCourses.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                {filteredCourses.map((course, index) => (
                  <p
                    key={index}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                    draggable
                    onDragStart={(e) => handleDragStart(e, course)} // Make course draggable
                  >
                    {course.courseAlias}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            {errors.length > 0 && (
              <div className="absolute bottom-2 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">Errors found</h3>
                </div>
                {errors.map((error, index) => (
                  <p key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                    {error.errorMessage}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <div className="col-span-3 space-y-6">
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
        <div className="mt-4 space-y-2">
          {errors.length > 0 && (
              <div className="absolute bottom-2 bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200 mb-2">
                  <AlertCircle className="h-5 w-5" />
                  <h3 className="font-medium">Errors found</h3>
                </div>
                  {errors.map((error, index) => (
                    <p key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                      {error.errorMessage}
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
const Course = ({ courseAlias, id, semester, handleDragStart, metadata, inSearch, conflicts, errors, setErrors }) => {
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

  // useEffect(() => {
  //   if (conflicts.length === 0) {
  //     // Remove errors for this course if there are no conflicts
  //     const updatedErrors = errors.filter(
  //       (err) => !(err.errorType === "prerequisite_conflict" && err.course === courseAlias)
  //     );
  
  //     // Only update errors if something was actually removed
  //     if (updatedErrors.length !== errors.length) {
  //       setErrors(updatedErrors);
  //     }
  //   } else {
  //     // Generate the error message
  //     const inlineError = conflicts.map((group) => `(${group.join(" OR ")})`).join(" AND ");
  //     const errorBoardMessage = `You must take ${inlineError} before taking ${courseAlias}`;
  
  //     // Check if the error already exists
  //     const errorIndex = errors.findIndex(
  //       (err) => err.errorType === "prerequisite_conflict" && err.course === courseAlias
  //     );
  
  //     if (errorIndex !== -1) {
  //       // Update the existing error if it already exists
  //       const updatedErrors = [...errors];
  //       updatedErrors[errorIndex].errorMessage = errorBoardMessage;
  
  //       // Only update errors if the message has changed
  //       if (updatedErrors[errorIndex].errorMessage !== errors[errorIndex].errorMessage) {
  //         setErrors(updatedErrors);
  //       }
  //     } else {
  //       // Add a new error if it doesn't exist
  //       setErrors((prevErrors) => [
  //         ...prevErrors,
  //         {
  //           errorType: "prerequisite_conflict",
  //           errorMessage: errorBoardMessage,
  //           clickAction: "search_prerequisites",
  //           prerequisites: conflicts,
  //           course: courseAlias,
  //           semester: semester,
  //         },
  //       ]);
  //     }
  //   }
  // }, [conflicts]);
  //BUGGY CODE


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
      <DropIndicator beforeId={courseAlias} semester={semester} />
      <div
        draggable="true"
        onDragStart={(e) => {
          handleDragStart(e, { courseAlias, id, semester })
          handleMouseOut();
        }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseOut={(e) => handleMouseOut(e)}

        className={(conflicts.length > 0 ?`bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-200` : `dark:border-gray-600 dark:bg-gray-800`) +  " relative cursor-grab rounded border p-3 active:cursor-grabbing"}
      >
        <p className={ (conflicts.length > 0) ? `text-sm font-semibold text-red-800 dark:text-red-200` : `text-sm text-gray-800 dark:text-white font-semibold` }>{courseAlias}</p>
        <p className= { (conflicts.length > 0) ? `text-sm text-red-700 dark:text-red-300` : `text-sm text-gray-600 dark:text-gray-400`}>
          {
            (conflicts.length == 0) ? metadata.description : "Prerequisite " + getConflictMessage()
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


function Semester({ semester, semesterIndex, courses, setCourses, errors, setErrors }) {
  const [active, setActive] = useState(false);
  const [creditHours, setCreditHours] = useState(0);

  const handleDragStart = (e, course) => {
    console.log(course);
    e.dataTransfer.setData("courseAlias", course.courseAlias);
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

  const checkPrerequisites = (course) => {
    const filteredCourses = courses.filter((c) => c.semesterIndex < course.semesterIndex);
    const filteredCourseAliases = new Set(filteredCourses.map(c => c.courseAlias));

    // Find all prerequisite groups that are not fulfilled
    const unfulfilledPrereqGroups = course.prerequisites.filter(prereqGroup =>
      !prereqGroup.some(prereq => filteredCourseAliases.has(prereq))
    );
    return unfulfilledPrereqGroups;
  }

  const handleDragEnd = (e) => {
    const courseAlias = e.dataTransfer.getData("courseAlias");
    console.log(e);

    setActive(false);
    clearHighlights();
    const before = getNearestIndicator(e, getIndicators()).element.dataset.before || "-1";
    if (before !== courseAlias) {
      let copyOfCourses = [...courses];
      let courseIndex = copyOfCourses.findIndex((c) => c.courseAlias == courseAlias)
      let courseToTransfer = copyOfCourses.splice(courseIndex, 1)[0];
      courseToTransfer.semester = semester;
      courseToTransfer.semesterIndex = semesterIndex;
      if (before == "-1") {
        //goes at the very end
        copyOfCourses.push(courseToTransfer);
      }
      else {
        const targetIndex = (copyOfCourses.findIndex((c) => c.courseAlias == before));
        copyOfCourses.splice(targetIndex, 0, courseToTransfer); 
      }
      
      setCourses(copyOfCourses);
      checkPrerequisites(courseToTransfer);
    }
  }
  const filteredCourses = courses.filter((c) => (c.semester == semester));
  
  const totalCreditHours = filteredCourses.reduce((total, course) => {
    return total + course.creditHours;
  }, 0);
  

  
  const totalCreditHours = filteredCourses.reduce((total, course) => {
    return total + course.creditHours;
  }, 0);
  

  return (
    <div className="bg-gray-50 dark:bg-gray-800/20 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <h3 className= "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{semester}</h3>
        <span className="rounded text-sm text-neutral-400">
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

          return <Course key={c.courseID} courseAlias={c.courseAlias} semester={c.semester} conflicts={checkPrerequisites(c)} handleDragStart={handleDragStart} metadata={c}/>;
        })}
        <DropIndicator beforeId={null} semester={semester} />
      </div>
    </div>
  );
}
