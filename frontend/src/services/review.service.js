import axios from "axios";

const baseurl = "http://localhost:3000";

const getReviews = async () => {
  try {
    const response = await axios.get(`${baseurl}/api/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    throw error;
  }
};

const getReviewsForACourse = async (course) => {
  console.log(course);
  const response = await axios.get(`${baseurl}/api/reviews/course`, course);
  return response.data;
};

const addReview = async (review, courseId, userId, instructorID) => {
  const response = await axios.post(`${baseurl}/api/reviews`, {
    review,
    course: courseId,
    userId
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
    return response.data
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

export { getReviews, getReviewsForACourse, addReview, likeReview, dislikeReview, editReview, deleteReview, reportReview };