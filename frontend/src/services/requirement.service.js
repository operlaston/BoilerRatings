import axios from "axios";
const baseurl = "http://localhost:3000"

const getRequirements = async () => {
  const res = await axios.get(`${baseurl}/api/requirements`)
  return res.data;
}

const getCoursesFromRequirement = async (requirement) => {
  const res = await axios.put(`${baseurl}/api/requirements/courses`, { requirement })
  return res.data;
}

const createRequirement = async (requirement) => {
  const res = await axios.post(`${baseurl}/api/requirements`, requirement)
  return res.data
}

const deleteRequirement = async (requirementId) => {
  await axios.delete(`${baseurl}/api/requirements/${requirementId}`)
}

export { getRequirements, getCoursesFromRequirement, createRequirement, deleteRequirement }