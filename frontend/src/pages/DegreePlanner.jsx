import { useState } from "react";

const INITIAL_CLASSES= [
  {
    courseID: 0,
    courseAlias: "CS 180", 
    semester: "Fall 2025"
  }, 
  {
    courseID: 1,
    courseAlias: "CS 240", 
    semester: "Spring 2026"
  }, 
  {
    courseID: 2,
    courseAlias: "CS 252", 
    semester: "Spring 2026"
  }, 
]

const initialSemesters = [
  {
    semester: "Fall 2025",
    id: "F2025", 
    courses: [],
  }, 
  {
    semester: "Spring 2026", 
    id: "S2026",
    courses: [],
  }, 
]

export default function DegreePlanner() {
  const [courses, setCourses] = useState(INITIAL_CLASSES);
  return (
    <div className="flex flex-row">
      { 
        initialSemesters.map((s) => {
          return <Semester key= {s.id} semester={s.semester} id={s.id} courses={courses} setCourses={setCourses} />;
        })
      }
    </div>
  );
}

const Course = ({ courseAlias, id, semester, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={courseAlias} semester={semester} />
      <div
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { courseAlias, id, semester })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{courseAlias}</p>
      </div>
    </>
  );
};

const DropIndicator = ({ beforeId, semester }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-semester={semester}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

function Semester({ semester, id, courses, setCourses }) {
  const [active, setActive] = useState(false);

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

  const handleDragEnd = (e) => {
    const courseAlias = e.dataTransfer.getData("courseAlias");
    setActive(false);
    clearHighlights();
    const before = getNearestIndicator(e, getIndicators()).element.dataset.before || "-1";
    if (before !== courseAlias) {
      console.log("BEFORE ACTION: ", courses); 
      let copyOfCourses = [...courses];
      let courseIndex = copyOfCourses.findIndex((c) => c.courseAlias == courseAlias)
      let courseToTransfer = copyOfCourses.splice(courseIndex, 1)[0];
      courseToTransfer.semester = semester;
      console.log(copyOfCourses);
      console.log(courseToTransfer);
      if (before == "-1") {
        //goes at the very end
        copyOfCourses.push(courseToTransfer);
      }
      else {
        const targetIndex = (copyOfCourses.findIndex((c) => c.courseAlias == before));
        copyOfCourses.splice(targetIndex, 0, courseToTransfer); 
      }
      
      setCourses(copyOfCourses);
    }
  }
  const filteredCourses = courses.filter((c) => (c.semester == semester));

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className= "font-medium ${headingColor}">{semester}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCourses.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCourses.map((c) => {
          return <Course key={c.courseID} courseAlias={c.courseAlias} semester={c.semester} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} semester={semester} />
      </div>
    </div>
  );
}