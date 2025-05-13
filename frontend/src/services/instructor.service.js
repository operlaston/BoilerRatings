import axios from 'axios'

const baseurl = "http://localhost:3000"

const calculateDifficulty = async (instructorId, courseId) => {
    const res = await axios.put(`${baseurl}/api/instructors/difficulty/course/${instructorId}`, {
        courseId
    })
    return res.data
}
const addInstructor = async (name, gpa, rmp, rmpLink) => {
    const res = await axios.post(`${baseurl}/api/instructors/`, {name, gpa, rmp, rmpLink})
    return res.data
}
const getInstructors = async () => {
    const res = await axios.get(`${baseurl}/api/instructors`);
    return res.data
}
const saveInstructor = async (id, name, gpa, rmp, rmpLink, courses) => {
    const res = await axios.put(`${baseurl}/api/instructors/${id}/save`, {name, gpa, rmp, rmpLink, courses})
    return res.data
}
const deleteInstructor = async (id) => {
    const res = await axios.delete(`${baseurl}/api/instructors/${id}`)
    return res.data
}

export { calculateDifficulty, addInstructor, getInstructors, saveInstructor, deleteInstructor }