import axios from "axios"

const baseurl = 'http://localhost:3000'

const getCourses = async () => {
  const response = await axios.get(`${baseurl}/api/courses`)
  return response.data
}

const getCourseByName = async (name) => {
  const response = await axios.get(`${baseurl}/api/courses/${name}`)
  return response.data
}

const favoriteCourse = async (courseId, userId) => {
  const res = await axios.put(`${baseurl}/api/courses/favorite/${courseId}`, {
    userId
  })
  return res.data;
}

const updatePrerequisites = async (courseId, newPrerequisites) => {
  const res = await axios.put(`${baseurl}/api/courses/prerequisite/${courseId}`, { newPrerequisites })
  return res.data
}

const updateTimeToReview = async (courseId, newDate) => {
  const res = await axios.put(`${baseurl}/api/courses/date/${courseId}`, {newDate})
  return res.data
}

export const updateCourse = async (courseId, updatedData) => {
  const res = await axios.put(`${baseurl}/api/courses/${courseId}`, updatedData);
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await axios.get(`${baseurl}/api/courses/byid/${id}`);
  return res.data;
};


const deleteCourse = async (courseId) => {
  try {
    const response = await axios.delete(`${baseurl}/api/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete course');
  }
};

export { getCourses, getCourseByName, favoriteCourse, updatePrerequisites, updateTimeToReview, deleteCourse }