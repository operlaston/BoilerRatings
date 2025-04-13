import { useState } from "react"

const PrerequisiteRequirementForm = ({majors, setMajors}) => {
  const [selectedMajor, setSelectedMajor] = useState("")
  const [requirements, setRequirements] = useState(null)

  const handleMajorChange = (e) => {
    setSelectedMajor(e.target.value)
    if (e.target.value === "") return;
    setRequirements(majors.find(major => major.name === e.target.value).requirements)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()

  }

  return (
    <div className="flex flex-col items-center gap-6 min-h-screen bg-gray-900 text-white">
      <div className="pt-4 text-lg">
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
            <Requirement requirement={req} />
          )}
          <div className="border border-solid rounded-lg py-3 px-4">
            <form handleSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="text-lg">
                  <input id="name" type="text" placeholder="Requirement Name"
                    className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1"
                  />
                </div>
                <div>
                  <div className="text-lg">Subrequirement</div>
                  <input id="credits" type="text" placeholder="Number of Credits"
                    className="border-solid border-gray-500 border-b-1 placeholder-gray-500 focus:outline-none focus:border-white py-1"
                  />
                </div>
              </div>
              <button className="cursor-pointer border border-solid rounded-lg p-2" type="submit">Add Requirement</button>
            </form>
          </div>
        </div>
      }
    </div>
  )
}

export default PrerequisiteRequirementForm


const Requirement = ({requirement, handleDeleteRequirement}) => {
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
      <button className="bg-red-800 p-2 rounded-lg cursor-pointer">Delete Requirement</button>
    </div>
  )
}