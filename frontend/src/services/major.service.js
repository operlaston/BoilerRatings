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

const changeMajorName = async (majorId, newName) => {
  const res = await axios.put(`${baseurl}/api/majors/editname/${majorId}`, {newName})
  return res.data
}

const createMajor = async ({name, requirements}) => {
  const res = await axios.post(`${baseurl}/api/majors`, {name, requirements})
  return res.data
}

const deleteMajor = async (majorId) => {
  await axios.delete(`${baseurl}/api/majors/${majorId}`)
}

export { getMajors, getMajorById, addRequirementToMajor, changeMajorName, createMajor, deleteMajor }