import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddReviewForm from "../components/AddReviewForm.jsx";
import BaseReviewForm from "../components/BaseReviewForm.jsx";
import {
  Loader2,
  Star,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Trash2,
} from "lucide-react";
import {
  addReview,
  getReviewsForACourse,
  likeReview,
  dislikeReview
} from "../services/review.js";

import { getCourses } from "../services/courses.js";

const ReviewPage = ({ user, course, refreshCourses, setUser, setCourse, setCourses }) => {
  const [canAddReview, setCanAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  //const [currentUser] = useState({ id: "user-123" }); // Mock current user
  //const [courseID] = useState({ id: "67c935df060def50cc8955e4" }); // Mock current course
  const currentUser = user ?? {};
  const courseId = course.id;
  //getReviewsForACourse(course) <- this gets all the reveiws for a course given the course you want the reivews for
  //Also when this page gets integrated into the course page itself it shouldn't need this call since the course object given to the
  //Course page should have the reivews in it.
  // Temporary mock data - replace with real data later
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user) {
      //if user LOGGED IN add review section appears
      setCanAddReview(true);
    }
    getCourses()
      .then((listOfCourses) => {
        setCourses(listOfCourses);
        setReviews(listOfCourses.find(currCourse => currCourse.id === courseId).reviews);
      })
      .catch((err) => console.log("Could not retrieve list of courses", err));
  }, [])

  // useEffect(() => {
  //   console.log("refreshed reviews in reviewPage");
  // }, [course]);

  const handleDelete = async (reviewId) => {
    const response = addReview(reviewId, courseId);
    console.log(response);
  };

  // Handle like
  const handleLike = async (reviewId) => {
    try {
      if (user === null) {
        return
      }
      else {
        const {newUser, newReview} = await likeReview(reviewId, user.id)
        setUser(newUser)
        getCourses()
          .then((listOfCourses) => {
            setCourses(listOfCourses);
            setReviews(listOfCourses.find(currCourse => currCourse.id === courseId).reviews);
          })
          .catch((err) => console.log("Could not retrieve list of courses", err));
      }
    } catch (error) {
      console.log("an error occurred while liking a review", err)
    }
  };

  // handle dislike
  const handleDislike = async (reviewId) => {
    try {
      if (user === null) {
        return
      }
      else {
        const {newUser, newReview} = await dislikeReview(reviewId, user.id)
        setUser(newUser)
        getCourses()
          .then((listOfCourses) => {
            setCourses(listOfCourses);
            setReviews(listOfCourses.find(currCourse => currCourse.id === courseId).reviews);
          })
          .catch((err) => console.log("Could not retrieve list of courses", err));
      }
    } catch (error) {
      console.log("an error occurred while liking a review", err)
    }
  }

  const handleReviewSubmit = async (formData) => {
    try {
      if (formData.id) {
        // Update existing review
        const updatedReview = {
          ...formData,
          date: new Date().toISOString(),
        };
        setReviews((prev) =>
          prev.map((r) => (r.id === formData.id ? updatedReview : r))
        );
        //await
      } else {
        // Create new review, could be the problem here?
        const newReview = {
          ...formData,
          user: currentUser.id, //.id is correct
          date: new Date(),
          likes: 0,
          reports: [],
          instructor: null,
        };
        console.log(newReview);
        console.log(courseId);
        // Optimistically update UI first
        console.log("Set reviews says");
        console.log(reviews);
        setReviews((prev) => [newReview, ...prev]);


        await addReview(newReview, courseId); // NOTICE addReview might have isusues, changed from courseId
        await refreshCourses();
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setReviews(prev => prev.filter(r => r.id !== newReview.id));
      throw error;
    } finally {
      setEditingReview(null);
    }
  };

  const handleEdit = (reviewId) => {
    const review = reviews.find((r) => r.id === reviewId);
    setEditingReview(review);
    console.log("Handling editing", review);
  };

  const handleCancelEdit = () => setEditingReview(null);
  console.log("Review", reviews);

  return (
    <div className="w-full flex flex-col items-center p-4 dark:bg-gray-900 overflow-y-auto">
      {/* Content Container */}
      <div className="absolute w-full max-w-auto  p-6 space-y-6 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl z-10">
        {/* Average Rating Section */}
        <div className="text-center space-y-2 ">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            4.2/5
          </h2>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Based on {reviews.length} reviews
          </p>
        </div>

        {/* Reviews List */}
        <div className="flex-column space-y-6">
          {reviews.map((review) => (
            <div
              className="group relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-md transition-shadow"
            key={review.id}
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {review.user}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()} •{" "}
                    {review.semesterTaken}
                  </p>
                </div>

                {/* Rating and Actions */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-900 dark:text-white">
                      {review.enjoyment.toFixed(1)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* {canAddReview === true && (
                      <button
                        onClick={() => handleLike(review.id)}
                        className="p-1 hover:text-green-500 peer-checked:text-green-500 transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        <span className="sr-only">Like</span>
                      </button>
                    )}

                    {canAddReview === true && (
                      <button
                        onClick={() => handleDislike(review.id)}
                        className="p-1 hover:text-red-500 peer-checked:text-red-500 transition-colors"
                      >
                        <ThumbsDown className="w-5 h-5" />
                        <span className="sr-only">Dislike</span>
                      </button>
                    )} */}

                    {/* Show edit only for current user's reviews */}
                    {review.user.id === currentUser.id && (
                      <button
                        onClick={() => handleEdit(review.id)}
                        className="p-1 hover:text-blue-500 peer-checked:text-blue-500 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-5 h-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                    )}
                    {/* Show delete only for current user's reviews */}
                    {review.user.id === currentUser.id && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 hover:text-red-500  peer-checked:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Body */}
              <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    Difficulty: {review.difficulty}/5
                  </span>
                  <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    Enjoyment: {review.enjoyment}/5
                  </span>
                  {review.recommend && (
                    <span className="text-sm px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 rounded">
                      Recommends this course
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {review.reviewContent}
                </p>
              </div>

              {/* Like Count */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ThumbsUp 
                  className="w-4 h-4 cursor-pointer" 
                  onClick={() => handleLike(review.id)}
                  fill={user ? (user.likedReviews.find(currReview => {
                    return currReview.review === review.id && currReview.favorability === 1
                  }) ? "#9CA3AF" : "#000000") : "#000000"}
                />
                {/* #9CA3AF fill color */}
                <span>{review.likes}</span>
                <ThumbsDown 
                  className="w-4 h-4 cursor-pointer" 
                  onClick={() => handleDislike(review.id)} 
                  fill={user ? (user.likedReviews.find(currReview => {
                    return currReview.review === review.id && currReview.favorability === -1
                  }) ? "#9CA3AF" : "#000000") : "#000000"}
                />
              </div>

              {editingReview === review && (
                <BaseReviewForm
                  initialData={editingReview}
                  onSubmit={handleReviewSubmit}
                  onCancel={handleCancelEdit}
                  submitButtonText="Update Review"
                />
              )}
            </div>
          ))}

          {canAddReview === true && (
            <AddReviewForm
              onSubmit={handleReviewSubmit}
              canAddReview={canAddReview}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
