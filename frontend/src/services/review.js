import axios from "axios"

const baseurl = 'http://localhost:3000'

const getReviewsForACourse = async (course) => {
    const response = await axios.get(`${baseurl}/reviews/course`, course)
    return response.data
}

const addReview = async ( review, course ) => {
    const response = await axios.post(`${baseurl}/reviews`, {review, course})
    return response.data()
}
//I don't know how you have a review id without the rest of the data but just incase
//here is a way to get the rest of the review
const getReviewByID = async (review) => {
    const respone = await axios.post(`${baseurl}/reviews/${review._id}`)
    return response
}

export {getReviewsForACourse, addReview, getReviewByID}