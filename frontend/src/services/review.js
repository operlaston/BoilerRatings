import axios from "axios"

const baseurl = 'http://localhost:3000'

const getReviewsForACourse = async (course) => {
    console.log(course)
    const response = await axios.get(`${baseurl}/api/reviews/course`, course)
    return response.data
}

const addReview = async ( review, course ) => {
    const response = await axios.post(`${baseurl}/api/reviews`, {review, course})
    return response.data()
}
//I don't know how you have a review id without the rest of the data but just incase
//here is a way to get the rest of the review

// THIS FUNCTION DEFINITELY DOES NOT WORK PLEASE DON'T USE IT, CONSULT ME ABOUT IT IF YOU'RE WONDERING WHY (THIS IS MATTHEW)
// const getReviewByID = async (review) => {
//     const respone = await axios.post(`${baseurl}/reviews/${review._id}`)
//     return response
// }

const likeReview = async (reviewId, userId) => {
    await axios.put(`${baseurl}/api/reviews/like/${reviewId}`, {userId})
}

const dislikeReview = async (reviewId, userId) => {
    await axios.put(`${baseurl}/api/reviews/dislike/${reviewId}`, {userId})
}

export {getReviewsForACourse, addReview, likeReview, dislikeReview}