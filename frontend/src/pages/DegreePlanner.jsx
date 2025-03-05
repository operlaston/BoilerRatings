import { useState, useEffect } from "react";
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
    conflicts: [],
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
    conflicts: [],
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
    conflicts: [],

  }, 
  {
    courseID: 3,
    courseAlias: "CS 250", 
    semester: "Spring 2026", 
    semesterIndex: 5,
    description: "Systems programming",
    creditHours: 3,
    prerequisites: [["CS 240"], ["CS 180"]], 
    corequisites: [],
    conflicts: [],

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

export default function DegreePlanner() {
  const [courses, setCourses] = useState(INITIAL_CLASSES); // Initial courses state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [errors, setErrors] = useState(INITIAL_ERRORS); // Errors state
  const [degreePlanName, setDegreePlanName] = useState(""); // Degree plan name state

  // Filter courses based on the search query
  const filteredCourses = availableCourses.filter((course) =>
    course.courseAlias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the drag start event
  const handleDragStart = (e, course) => {
    e.dataTransfer.setData("courseAlias", course.courseAlias); // Set the courseAlias in dataTransfer
  };

  // Handle saving the degree plan
  const handleSaveDegreePlan = () => {
    if (degreePlanName.trim() === "") {
      alert("Please provide a name for the degree plan.");
      return;
    }
    // Logic for saving the degree plan can be added here
    console.log("Degree Plan saved as:", degreePlanName);
  };

  return (
    <div className="grid grid-cols-12 gap-6 w-full h-full min-h-screen bg-white dark:bg-gray-900 py-6 px-20">
      <div className="col-span-9 grid grid-cols-4 grid-rows-2 gap-4 grid-flow-col">
        {INITIAL_SEMESTERS.map((s) => {
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
        })}
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
            {filteredCourses.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
                {filteredCourses.map((course, index) => (
                  <p
                    key={index}
                    className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                    draggable
                    onDragStart={(e) => handleDragStart(e, course)}
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

          {/* Save Button */}
          <div className="mt-4">
            <button
              onClick={handleSaveDegreePlan}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              Save Degree Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

//add a SETERROR method and pass it in 
const Course = ({ course, handleDragStart }) => {
  const { courseAlias, semester, conflicts } = course;
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
      <DropIndicator beforeId={courseAlias} semester={semester} />
      <div
        draggable="true"
        onDragStart={(e) => {
          handleDragStart(e, { courseAlias, semester })
          handleMouseOut();
        }}
        onMouseOver={(e) => handleMouseOver(e)}
        onMouseOut={(e) => handleMouseOut(e)}
        className={(course.conflicts.length > 0 ?`bg-red-50 dark:bg-red-900/20 border-red-600 dark:border-red-200` : `dark:border-gray-600 dark:bg-gray-800`) +  " relative cursor-grab rounded border p-3 active:cursor-grabbing"}
      >
        <p className={ (course.conflicts.length > 0) ? `text-sm font-semibold text-red-800 dark:text-red-200` : `text-sm text-gray-800 dark:text-white font-semibold` }>{courseAlias}</p>
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


function Semester({ semester, semesterIndex, courses, setCourses, errors, setErrors }) {
  const [active, setActive] = useState(false);
  const [creditHours, setCreditHours] = useState(0);

  useEffect(() => {
    updateErrors(courses);
  }, [])

  const handleDragStart = (e, course) => {
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
      const conflicts = checkPrerequisites(course);
      return { ...course, conflicts }; // Update the conflicts field
    });
    const updatedErrors = errors.filter((err) => err.errorType !== "prerequisite_conflict");
      updatedCourses.forEach((course) => {
        if (course.conflicts.length > 0) {
          const inlineError = course.conflicts
            .map((group) => `(${group.join(" OR ")})`)
            .join(" AND ");
          const errorBoardMessage = `You must take ${inlineError} before ${course.courseAlias}`;
          updatedErrors.push({
            errorType: "prerequisite_conflict",
            errorMessage: errorBoardMessage,
            clickAction: "search_prerequisites",
            prerequisites: course.conflicts,
            course: course.courseAlias,
            semester: course.semester,
          });
        }
      });
      setErrors(updatedErrors);
      return updatedCourses;
  }

  const handleDragEnd = (e) => {
    const courseAlias = e.dataTransfer.getData("courseAlias");

    setActive(false);
    clearHighlights();
    const before = getNearestIndicator(e, getIndicators()).element.dataset.before || "-1";
    if (before !== courseAlias) {
      let reorderedCourses = [...courses];
      let courseIndex = reorderedCourses.findIndex((c) => c.courseAlias == courseAlias)
      let courseToTransfer = reorderedCourses.splice(courseIndex, 1)[0];
      courseToTransfer.semester = semester;
      courseToTransfer.semesterIndex = semesterIndex;
      if (before == "-1") {
        //goes at the very end
        reorderedCourses.push(courseToTransfer);
      }
      else {
        const targetIndex = (reorderedCourses.findIndex((c) => c.courseAlias == before));
        reorderedCourses.splice(targetIndex, 0, courseToTransfer); 
      }
      
      setCourses(updateErrors(reorderedCourses));
    }
  }
  const filteredCourses = courses.filter((c) => (c.semester == semester));
  
  const totalCreditHours = filteredCourses.reduce((total, course) => {
    return total + course.creditHours;
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
