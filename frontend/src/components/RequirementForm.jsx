import { useEffect, useState } from "react"
import { createRequirement, deleteRequirement } from "../services/requirement.service"
import { addRequirementToMajor, getMajors } from "../services/major.service"

const RequirementForm = ({majors, setMajors, courses}) => {
  const [selectedMajor, setSelectedMajor] = useState("")
  const [requirements, setRequirements] = useState(null)
  const [requirementName, setRequirementName] = useState("")
  const [subrequirements, setSubrequirements] = useState([])
  const [error, setError] = useState("")

  const handleMajorChange = (e) => {
    setSelectedMajor(e.target.value)
    if (e.target.value === "") return;
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
      const majorId = majors.find(major => major.name === selectedMajor).id
      setRequirements([...requirements, addRequirement])
      setMajors(majors.map(major => major.id === majorId ? {...major, requirements: [...major.requirements, addRequirement]} : major))
      setRequirementName("")
      setSubrequirements([])
      const newRequirement = await createRequirement(addRequirement)
      const newMajor = await addRequirementToMajor(newRequirement.id, majorId)
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

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen bg-gray-900 text-white p-4">
      <div className="text-lg">
        <label htmlFor="majors-dropdown">
          Select a major to change the degree requirements of: &nbsp;
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
        <div className="flex flex-col gap-2">
          {requirements.map(req =>
            <Requirement requirement={req} handleDeleteRequirement={handleDelete}/>
          )}
          <div className="border border-solid rounded-lg py-3 px-4">
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
                      className="cursor-pointer border border-solid rounded-lg p-2"
                      type="button"
                    >
                      New Subrequirement
                    </button>
                    <button
                      onClick={() => setSubrequirements(subrequirements.slice(0, -1))}
                      className="cursor-pointer border border-solid border-red-800 text-red-600 rounded-lg p-2"
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
      await handleDeleteRequirement(requirement.id)
    }
  }

  return (
    <div className="border border-solid py-3 px-4 rounded-xl flex flex-col gap-2">
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
      <div className="flex gap-2">
        <button
          type="button"
          className="cursor-pointer bg-green-600 text-white rounded-lg p-2 text-sm"
          onClick={() => setSubrequirement({credits: subrequirement.credits, courses: [...subrequirement.courses, ""]})}
        >
          New Course
        </button>
        <button
          type="button"
          className="cursor-pointer bg-red-800 text-white rounded-lg p-2"
          onClick={() => setSubrequirement({
            ...subrequirement,
            courses: subrequirement.courses.slice(0, -1)
          }
          )}
        >
          Remove Course
        </button>
      </div>
    </div>
  )
}