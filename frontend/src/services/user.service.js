import axios from "axios";

const baseurl = "http://localhost:3000/api/users"

const getUserByUsername = async (username) => {
  const response = await axios.get(`${baseurl}/username/${username}`)
  return response.data
}

const getUserById = async (id) => {
  const response = await axios.get(`${baseurl}/${id}`)
  return response.data
}

const deleteUser = async (id) => {
  const response = await axios.delete(`${baseurl}/${id}`)
  return response
}

const updateUser = async (user, username, majors, minors, gradSemester) => {
  const response = await axios.put(`${baseurl}/update/${user.id}`, {
    username, majors, minors, gradSemester
  })
  return response
}

const isCourseFavorited = async (userId, courseId) => {
  const res = await axios.put(`${baseurl}/favorite/${userId}`, {
    courseId
  })
  return res.data;
}

const banUser = async (userId) => {
  const res = await axios.post(`${baseurl}/ban/${userId}`)
  return res.data;
}

const flagUser = async (userid, flag, reason) => {
  const res = await axios.put(`${baseurl}/flags/${userid}`, {flag, reason})
}

export { getUserByUsername, getUserById, deleteUser, updateUser, isCourseFavorited, banUser,flagUser }