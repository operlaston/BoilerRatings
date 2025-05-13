import axios from 'axios'

const baseurl = "http://localhost:3000"

export const signup = async (email, password) => {
    const response = await axios.post(`${baseurl}/api/users`, {
        email, password
    })
    return response.data
}

export const verify = async (email, code) => {
    const response = await axios.post(`${baseurl}/api/users/verify`, {
        email, code
    })
    console.log(response.data)
    if (response.data.deleted) {
        throw new Error("Verificaiton code expired")
    }
    return response.data
}

export const onboard = async (user, username,  majors, minors, gradSemester) => {
    console.log(user)
    const response = await axios.post(`${baseurl}/api/users/${user.id}`, {
        username, majors, minors, gradSemester
    })
    return response.data
}