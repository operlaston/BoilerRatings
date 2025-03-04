import axios from "axios"

const baseurl = 'http://localhost:3000'

const getCourses = async () => {
  const response = await axios.get(`${baseurl}/courses`)
  return response.data
}

export { getCourses }