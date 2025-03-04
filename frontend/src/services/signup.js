import axios from 'axios'

const baseurl = "http://localhost:3000"

export const signup = async (email, password) => {
    const response = await axios.post(`${baseurl}/api/users`, {
        email, password
    })
    console.log("SIGNUP RESPONSE", response.data);
    return response.data
}