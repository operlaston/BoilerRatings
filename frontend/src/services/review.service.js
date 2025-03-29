import axios from "axios";

const baseurl = "http://localhost:3000";

const getReviewsForACourse = async (course) => {
  console.log(course);
  const response = await axios.get(`${baseurl}/api/reviews/course`, course);
  return response.data;
};

const getUserById= async (userId) => {
  const response = await axios.get(`${baseurl}/api/users/${userId}`)
  console.log(response.data)
  return response.data
}

const addReview = async (review, courseId) => {
  const response = await axios.post(`${baseurl}/api/reviews`, {
    review,
    course: courseId, //this was the issue, it was course by itself before
  });
  return response.data;
};

const editReview = async (reviewId, updatedReview) => {
  const response = await axios.put(
    `${baseurl}/api/reviews/${reviewId}`, {updatedReview});
  return response.data;
};

const likeReview = async (reviewId, userId) => {
    const response = await axios.put(`${baseurl}/api/reviews/like/${reviewId}`, {userId})
    return response.data // contains new user and review objects
}

const dislikeReview = async (reviewId, userId) => {
    const response = await axios.put(`${baseurl}/api/reviews/dislike/${reviewId}`, {userId})
    return response.data
}

const deleteReview = async (reviewId) => {
  console.log(reviewId)
  const response = await axios.delete(`${baseurl}/api/reviews/${reviewId}`)
  return response.data
}

const reportReview = async (reviewId, reportString, reportReason) => {
  const response = await axios.put(`${baseurl}/api/reviews/report/${reviewId}`, {reportString, reportReason})
  return response.data
}

export { getReviewsForACourse, getUserById, addReview, likeReview, dislikeReview, editReview, deleteReview, reportReview };
