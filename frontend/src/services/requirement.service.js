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

export { getRequirements, getCoursesFromRequirement }