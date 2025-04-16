import axios from 'axios'
const baseurl = "http://localhost:3000"

const getMajors = async () => {
  const res = await axios.get(`${baseurl}/api/majors`)
  return res.data;
}

const getMajorById = async (majorId) => {
  const res = await axios.get(`${baseurl}/api/majors/${majorId}`);
  return res.data;
}

const addRequirementToMajor = async (newRequirementId, majorId) => {
  const res = await axios.put(`${baseurl}/api/majors/addrequirement/${majorId}`, {newRequirementId})
  return res.data
}

export { getMajors, getMajorById, addRequirementToMajor }