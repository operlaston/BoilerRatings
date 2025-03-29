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

export { getCourses, getCourseByName }