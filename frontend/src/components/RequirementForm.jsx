import { useEffect, useState } from "react"
import { createRequirement, deleteRequirement } from "../services/requirement.service"
import { addRequirementToMajor, getMajors, changeMajorName, createMajor, deleteMajor } from "../services/major.service"

const RequirementForm = ({majors, setMajors, courses}) => {
  const [selectedMajor, setSelectedMajor] = useState("")
  const [majorName, setMajorName] = useState("")
  const [requirements, setRequirements] = useState(null)
  const [requirementName, setRequirementName] = useState("")
  const [subrequirements, setSubrequirements] = useState([])
  const [error, setError] = useState("")
  const [newMajorName, setNewMajorName] = useState("")

  const handleMajorChange = (e) => {
    setSelectedMajor(e.target.value)
    if (e.target.value === "") {
      setRequirements(null)
      setError("")
      return;
    }
    setMajorName("")
    setRequirements(majors.find(major => major.name === e.target.value).requirements)
    setError("")
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    // verify credits inputs
    for (const s of subrequirements) {
      if (!Number.isInteger(Number(s.credits)) || parseInt(s.credits) < 0) {
        setError("Credits must be a valid integer >= 0")
        return;
      }
    }

    // verify courses exist
    const courseSet = new Set(courses.map(course => course.number))
    for (const s of subrequirements) {
      for (const course of s.courses) {
        if (!courseSet.has(course)) {
          setError("At least one course entered doesn't exist")
          return;
        }
      }
    }

    // send request to backend to create new requirement for selected major
    try {
      const addRequirement = {name: requirementName, subrequirements: subrequirements}
      const newRequirement = await createRequirement(addRequirement)
      const majorId = majors.find(major => major.name === selectedMajor).id
      const newMajor = await addRequirementToMajor(newRequirement.id, majorId)
      setRequirements([...requirements, newRequirement])
      setMajors(majors.map(major => major.id === majorId ? {...major, requirements: [...major.requirements, newRequirement]} : major))
      setRequirementName("")
      setSubrequirements([])
    }
    catch(e) {
      console.error("an error occurred while creating a new requirement", e)
    }
  }

  const handleDelete = async (requirementId) => {
    try {
      await deleteRequirement(requirementId)
      const newMajors = await getMajors()
      setMajors(newMajors)
      setRequirements(newMajors.find(major => major.name === selectedMajor).requirements)
    }
    catch(e) {
      console.error("an error occurred while trying to delete a requirement", e)
    }
  }

  const handleNameChange = async () => {
    try {
      const majorId = majors.find(major => major.name === selectedMajor).id
      await changeMajorName(majorId, majorName)
      const newMajors = majors.map(major => major.id === majorId ? {...major, name: majorName} : major)
      setMajors(newMajors)
      setMajorName("")
      setSelectedMajor(majorName)
    }
    catch(e) {
      console.error("an error occurred while trying to change a major's name", e)
    }
  }

  const handleCreateMajor = async () => {
    try {
      const returnedMajor = await createMajor({name: newMajorName, requirements: []})
      setMajors([...majors, returnedMajor])
      setNewMajorName("")
    }
    catch(e) {
      console.error("an error occurred while creating new major")
    }
  }

  const handleDeleteMajor = async () => {
    if (window.confirm("Delete the selected major?")) {
      const majorId = majors.find(major => major.name === selectedMajor).id
      try {
        await deleteMajor(majorId)
        setMajors(majors.filter(major => major.id !== majorId))
        setSelectedMajor("")
        setRequirements(null)
      }
      catch(e) {
        console.error("couldn't delete major", e)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen text-white p-4">
      <div className="flex flex-col items-center gap-2">
        <div className="text-lg">Create a new major in the database</div>
        <div className="text-white flex flex-col
          dark:bg-gray-800 rounded-lg shadow-sm border border-gray-700 dark:hover:border-gray-600 transition-all py-3 px-4 min-w-80">
            <input
              type="text"
              id="majorName"
              value={newMajorName}
              placeholder="New major name"
              onChange={(e) => {setNewMajorName(e.target.value)}}
              className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1 w-full mb-4"
            />
            <button
              className="cursor-pointer bg-white text-gray-900 rounded-lg p-[0.35rem] font-semibold"
              onClick={handleCreateMajor}
            >
              Create Major
            </button>
        </div>
      </div>
      <div className="text-lg">or</div>
      <div className="text-lg">
        <label htmlFor="majors-dropdown">
          Select a major to modify its name or requirements: &nbsp;
        </label>
        <select
          id="majors-dropdown"
          value={selectedMajor}
          onChange={handleMajorChange}
          className="border rounded-md p-1 bg-white dark:bg-gray-800 dark:text-gray-200"
        >
          <option value="">Choose a major</option>
          {majors.map(major =>
            <option key={major.name} value={major.name}>{major.name}</option>
          )}
        </select>
      </div>
      {requirements === null ?
        "" :
        <div className="flex flex-col gap-2"
        >
          <div className="text-white flex flex-col
          dark:bg-gray-800 rounded-lg shadow-sm border border-gray-700 dark:hover:border-gray-600 transition-all py-3 px-4">
            <div className="text-lg font-bold">Major Name</div>
            <input
              type="text"
              id="majorName"
              value={majorName}
              placeholder={selectedMajor}
              onChange={(e) => {setMajorName(e.target.value)}}
              className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1 w-full mb-4"
            />
            <button
              className="cursor-pointer bg-white text-gray-900 rounded-lg p-2 font-semibold"
              onClick={handleNameChange}
            >
              Change Name
            </button>
          </div>
          {requirements.map(req =>
            <Requirement requirement={req} handleDeleteRequirement={handleDelete}/>
          )}
          <div className="dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all py-3 px-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="text-lg">
                  <input
                    type="text"
                    placeholder="Requirement Name"
                    value={requirementName}
                    onChange={(e) => {setRequirementName(e.target.value);setError("")}}
                    className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1 w-full"
                  />
                </div>
                <div>
                  <div className="pb-6 flex flex-col gap-2">
                    {
                      subrequirements.map((subreq, index) =>
                        <Subrequirement key={index} subrequirements={subrequirements} setSubrequirements={setSubrequirements} subreqsIndex={index} setError={setError}/>
                      )
                    }
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSubrequirements([...subrequirements, {}])}
                      className="cursor-pointer bg-green-800 rounded-lg p-2"
                      type="button"
                    >
                      New Subrequirement
                    </button>
                    <button
                      onClick={() => setSubrequirements(subrequirements.slice(0, -1))}
                      className="cursor-pointer bg-red-900 rounded-lg p-2"
                      type="button"
                    >
                      Remove Subrequirement
                    </button>
                  </div>
                </div>
              </div>
              {error !== "" ? <div className="text-red-800">{error}</div> : ''}
              <button className="cursor-pointer bg-white text-gray-900 rounded-lg p-2 font-semibold" type="submit">Add Requirement</button>
            </form>
          </div>
          <button
            onClick={handleDeleteMajor}
            className="cursor-pointer bg-red-900 rounded-lg p-2"
            type="button"
          >
            Delete Major
          </button>
        </div>
      }
    </div>
  )
}

export default RequirementForm


const Requirement = ({requirement, handleDeleteRequirement}) => {
  const handleDelete = async () => {
    let confirmation = confirm("Are you sure you want to delete this?")
    if (confirmation) {
      console.log("requirement", requirement)
      await handleDeleteRequirement(requirement.id)
    }
  }

  return (
    <div className="dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all py-3 px-4 rounded-xl flex flex-col gap-2">
      <h2 className="text-lg"><b>Requirement: </b>{requirement.name}</h2>
      <div>
        {
          requirement.subrequirements.map(subreq =>
            <div key={subreq._id} className="">
              {subreq.credits} credits from the following:
              {subreq.courses.map(course =>
                <span key={course._id}> {course}</span>
              )}
            </div>
          )
        }
      </div>
      <button className="bg-red-800 p-2 rounded-lg cursor-pointer" onClick={handleDelete}>Delete Requirement</button>
    </div>
  )
}

const Subrequirement = ({subrequirements, setSubrequirements, subreqsIndex, setError}) => {
  const [subrequirement, setSubrequirement] = useState({
    credits: "",
    courses: []
  })

  useEffect(() => {
    setSubrequirements(subrequirements.map((s, i) => i === subreqsIndex ? subrequirement : s))
  }, [subrequirement])

  return (
    <div className="flex flex-col gap-2">
      <div className="text-lg">Subrequirement</div>
      <input 
        type="text" 
        placeholder="Number of Credits"
        value={subrequirement.credits}
        onChange={(e) => {setSubrequirement({
          credits: e.target.value,
          courses: subrequirement.courses
        });setError("")}}
        className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1 w-full"
      />
      <div>
        {
          subrequirement.courses.map((course, index) =>
            <div>
              <input
                type="text"
                placeholder="Course Number (e.g. CS 18000)"
                value={course}
                onChange={(e) => {setSubrequirement({
                  credits: subrequirement.credits, 
                  courses: subrequirement.courses.map((c, i) => i === index ? e.target.value : c)
                });setError("")}}
                className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1 w-full"
              />
            </div>
          )
        }
      </div>
      <div className="flex gap-2 items-center">
        <button
          type="button"
          className="cursor-pointer bg-green-600 text-white rounded-full px-2 py-1 text-sm/tight"
          onClick={() => setSubrequirement({credits: subrequirement.credits, courses: [...subrequirement.courses, ""]})}
        >
          +
        </button>
        <div>
          Courses
        </div>
        <button
          type="button"
          className="cursor-pointer bg-red-800 text-white rounded-full px-2 py-1 text-sm/tight"
          onClick={() => setSubrequirement({
            ...subrequirement,
            courses: subrequirement.courses.slice(0, -1)
          }
          )}
        >
          -
        </button>
      </div>
    </div>
  )
}