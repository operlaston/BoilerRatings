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
  dislikeReview,
  editReview,
  deleteReview,
} from "../services/review.service.js";
import { getCourses } from "../services/course.service.js";

const ReviewPage = ({
  user,
  course,
  refreshCourses,
  setUser,
  setCourse,
  setCourses,
}) => {
  const [canAddReview, setCanAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const currentUser = user ?? {};
  const courseId = course.id;
  const [reviews, setReviews] = useState([]);
  const [filterType, setFilterType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);

  // Filter options
  const semesterOptions = [
    'Fall 2023',
    'Winter 2023',
    'Spring 2023',
    'Summer 2023',
    'Fall 2024',
    'Winter 2024',
    'Spring 2024',
    'Summer 2024',
    'Winter 2025',
    'Spring 2025'
  ];

  // Likes range options
  const likesOptions = [
    '0-2',
    '3-5',
    '6-8',
    '9+'
  ];

  useEffect(() => {
    // Existing logic
    if (user) {
      //if user LOGGED IN add review section appears
      console.log("logged in right now");
      setCanAddReview(true);
    }

    // Fetch courses and set reviews
    getCourses()
      .then((listOfCourses) => {
        setCourses(listOfCourses);
        setReviews(
          listOfCourses.find((currCourse) => currCourse.id === courseId).reviews
        );
        const courseReviews = listOfCourses.find(c => c.id === courseId)?.reviews || [];
        setReviews(courseReviews);
        
        // Apply filters to the newly loaded reviews
        if (!filterType || !selectedFilter) {
          setFilteredReviews(courseReviews);
        } else {
          const filtered = courseReviews.filter(review => {
            if (filterType === 'semester') {
              return review.semesterTaken === selectedFilter;
            } else if (filterType === 'likes') {
              const likes = review.likes || 0;
              if (selectedFilter === '0-2') return likes >= 0 && likes <= 2;
              if (selectedFilter === '3-5') return likes >= 3 && likes <= 5;
              if (selectedFilter === '6-8') return likes >= 6 && likes <= 8;
              if (selectedFilter === '9+') return likes >= 9;
            }
            return true;
          });
          setFilteredReviews(filtered);
        }
      })
      .catch((err) => console.log("Could not retrieve list of courses", err));
  }, [user, courseId, filterType, selectedFilter]);

  const handleDeleteClick = (reviewId) => {
    setSelectedReviewId(reviewId);
  };

  const handleDelete = (reviewId) => {
    deleteReview(reviewId)
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== reviewId));
        setFilteredReviews(filteredReviews.filter((review) => review.id !== reviewId));
        setSelectedReviewId(null);
        refreshCourses();
      })
      .catch((err) => console.log("Could not delete review", err));
  };

  const handleEdit = (reviewId) => {
    const reviewToEdit = reviews.find((review) => review.id === reviewId);
    setEditingReview(reviewToEdit);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleReviewSubmit = (reviewData) => {
    if (editingReview) {
      // Update existing review
      editReview(editingReview.id, reviewData)
        .then((updatedReview) => {
          setReviews(
            reviews.map((review) =>
              review.id === updatedReview.id ? updatedReview : review
            )
          );
          setFilteredReviews(
            filteredReviews.map((review) =>
              review.id === updatedReview.id ? updatedReview : review
            )
          );
          setEditingReview(null);
          refreshCourses();
        })
        .catch((err) => console.log("Could not update review", err));
    } else {
      // Add new review
      addReview(courseId, reviewData)
        .then((newReview) => {
          setReviews([newReview, ...reviews]);
          setFilteredReviews([newReview, ...filteredReviews]);
          refreshCourses();
        })
        .catch((err) => console.log("Could not add review", err));
    }
  };

  const handleLike = (reviewId) => {
    likeReview(reviewId)
      .then((updatedReview) => {
        setReviews(
          reviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );
        setFilteredReviews(
          filteredReviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );
        refreshCourses();
      })
      .catch((err) => console.log("Could not like review", err));
  };

  const handleDislike = (reviewId) => {
    dislikeReview(reviewId)
      .then((updatedReview) => {
        setReviews(
          reviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );
        setFilteredReviews(
          filteredReviews.map((review) =>
            review.id === updatedReview.id ? updatedReview : review
          )
        );
        refreshCourses();
      })
      .catch((err) => console.log("Could not dislike review", err));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {course.department} {course.number}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-900 dark:text-white">
                {course.avgEnjoyment?.toFixed(1) || "N/A"}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Based on {filteredReviews.length} reviews
              {filteredReviews.length !== reviews.length && ` (filtered from ${reviews.length})`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          {/* First dropdown - filter type */}
          <select
            value={filterType || ''}
            onChange={(e) => {
              setFilterType(e.target.value || null);
              setSelectedFilter(null);
            }}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="" className="dark:text-white-300">Filter by...</option>
            <option value="semester" className="dark:text-white">Semester Taken</option>
            <option value="likes" className="dark:text-white">Number of Likes</option>
          </select>

          {/* Second dropdown - filter value (conditionally rendered) */}
          {filterType && (
            <select
              value={selectedFilter || ''}
              onChange={(e) => setSelectedFilter(e.target.value || null)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="">Select {filterType === 'semester' ? 'semester' : 'likes range'}...</option>
              {(filterType === 'semester' ? semesterOptions : likesOptions).map(option => (
                <option key={option} value={option} className="dark:text-white">
                  {option}
                </option>
              ))}
            </select>
          )}

          {/* Clear filters button */}
          {(filterType || selectedFilter) && (
            <button
              onClick={() => {
                setFilterType(null);
                setSelectedFilter(null);
              }}
              className="p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Reviews List */}
        <div className="flex-column space-y-6">
          {filteredReviews.map((review) => (
            <div
              className="group relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-md transition-shadow"
              key={review.id}
            >
              {/* Review Header */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {review.anon ? "Anonymous" : review.user || ""}
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
                      {review.enjoyment || 0}
                    </span>
                  </div>

                  {/* Confirmation popup */}
                  {selectedReviewId === review.id && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          Delete Review?
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300">
                          Are you sure you want to delete this review? This
                          action cannot be undone.
                        </p>

                        <div className="mt-6 flex gap-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent clicks on overlay from bubbling
                              setSelectedReviewId(null)
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent clicks on overlay from bubbling
                              handleDelete(review.id);
                            }}
                            className="w-full bg-red-600 text-white 
                       p-2 rounded-lg hover:bg-red-700 transition-colors 
                       flex items-center justify-center gap-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Action Buttons, visible only on hover */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Show edit only for current user's reviews */}
                    {currentUser?.id && review.user === currentUser.id && (
                      <button
                        onClick={() => handleEdit(review.id)}
                        className="p-1 hover:text-blue-500 peer-checked:text-blue-500 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-5 h-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                    )}
                    {/* Show delete only for current user's reviews */}
                    {currentUser?.id && review.user === currentUser.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(review.id);
                        }}
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
                    Difficulty: {review.difficulty || 0}/5
                  </span>
                  <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    Enjoyment: {review.enjoyment || 0}/5
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
                  fill={
                    user
                      ? user.likedReviews.find((currReview) => {
                          return (
                            currReview.review === review.id &&
                            currReview.favorability === 1
                          );
                        })
                        ? "#9CA3AF"
                        : "#00000000"
                      : "#00000000"
                  }
                />
                {/* #9CA3AF fill color */}
                <span>{review.likes}</span>
                <ThumbsDown
                  className="w-4 h-4 cursor-pointer"
                  onClick={() => handleDislike(review.id)}
                  fill={
                    user
                      ? user.likedReviews.find((currReview) => {
                          return (
                            currReview.review === review.id &&
                            currReview.favorability === -1
                          );
                        })
                        ? "#9CA3AF"
                        : "#00000000"
                      : "#00000000"
                  }
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