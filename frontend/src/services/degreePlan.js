import axios from 'axios'

const baseurl = "http://localhost:3000"

const createDegreePlan = async (user, planName, savedCourses) => {
    console.log("Sending")
    const response = await axios.post(`${baseurl}/api/degreeplans`, {
        user, planName, savedCourses
    })
    return response.data
}

const getAllPlans = async (user) => {
    const response = await axios.get(`${baseurl}/api/degreeplans`, user)
    return response.data
}

export { createDegreePlan,  getAllPlans }