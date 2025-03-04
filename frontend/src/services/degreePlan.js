import axios from 'axios'

const baseurl = "http://localhost:3000"

const createDegreePlan = async (degreePlan, user) => {
    const response = await axios.post(`${baseurl}/api/degreeplans`, {
        degreePlan, user
    })
    return response.data
}

const saveDegreePlan = async (degreePlan) => {
    const response = await axios.put(`${baseurl}/api/degreeplans/${degreePlan._id}`, 
        degreePlan)
    return response.data
}

const getAllPlans = async (user) => {
    const response = await axios.get(`${baseurl}/api/degreeplans`, user)
    return response.data
}

export { createDegreePlan, saveDegreePlan, getAllPlans }