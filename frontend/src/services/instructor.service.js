import axios from 'axios'

const baseurl = "http://localhost:3000"

const calculateDifficulty = async (instructorId, courseId) => {
    const res = await axios.put(`${baseurl}/instructors/difficulty/course/${instructorId}`, {
        courseId
    })
    return res.data
}

export { calculateDifficulty }