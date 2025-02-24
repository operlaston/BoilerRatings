import axios from 'axios'

const baseurl = "http://localhost:3000"

const login = async (email, password) => {
  const userCredentials = {
    email,
    password
  }
  const response = await axios.post(`${baseurl}/api/login`, userCredentials)
  return response.data
}

export { login }