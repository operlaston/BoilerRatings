import axios from "axios";

const baseurl = "http://localhost:3000/api/users"

const getUserByUsername = async (username) => {
  const response = await axios.get(`${baseurl}/username/${username}`)
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

export { getUserByUsername, deleteUser, updateUser }