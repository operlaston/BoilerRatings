import axios from "axios"

const baseurl = 'http://localhost:3000'

const getCourses = async () => {
  const response = await axios.get(`${baseurl}/api/courses`)
  return response.data
}

const getCourseByName = async (name) => {
  const response = await axios.get(`${baseurl}/api/courses/${name}`)
  return response.data
}

const favoriteCourse = async (courseId, userId) => {
  const res = await axios.put(`${baseurl}/api/courses/favorite/${courseId}`, {
    userId
  })
  return res.data;
}

const updatePrerequisites = async (courseId, newPrerequisites) => {
  const res = await axios.put(`${baseurl}/api/courses/prerequisite/${courseId}`, { newPrerequisites })
  return res.data
}

export { getCourses, getCourseByName, favoriteCourse, updatePrerequisites }