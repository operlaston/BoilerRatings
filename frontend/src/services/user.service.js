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

export { getUserByUsername, deleteUser }