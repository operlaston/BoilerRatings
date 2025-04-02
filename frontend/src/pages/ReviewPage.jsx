import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import AddReviewForm from "../components/AddReviewForm.jsx";
import BaseReviewForm from "../components/BaseReviewForm.jsx";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Star,
  Pencil,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Flag,
  CheckCircle,
} from "lucide-react";
import {
  getUserById,
  addReview,
  likeReview,
  dislikeReview,
  editReview,
  deleteReview,
  reportReview,
} from "../services/review.service.js";
import { getMajorById, getMajors } from "../services/major.service.js";

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
  const [reportingReview, setReportingReview] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reportId, setReportId] = useState(null)

  const [userMap, setUserMap] = useState({});
  const [majorMap, setMajorMap] = useState({});
  const [majorNameMap, setMajorNameMap] = useState({}); // New state for major name mapping

  const currentUser = user ?? {};
  const courseId = course.id;
  const [reviews, setReviews] = useState(course.reviews || []);
  const [filterType, setFilterType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState(course.reviews || []);
  const [availableMajors, setAvailableMajors] = useState([]); // New state for available majors
  const navigate = useNavigate();

  // Filter options
  const semesterOptions = [
    "Fall 2023",
    "Winter 2023",
    "Spring 2023",
    "Summer 2023",
    "Fall 2024",
    "Winter 2024",
    "Spring 2024",
    "Summer 2024",
    "Winter 2025",
    "Spring 2025",
  ];

  // Likes range options
  const likesOptions = ["0-2", "3-5", "6-8", "9+"];

  useEffect(() => {
    if (user) {
      setCanAddReview(true);
    }
    // Initialize with the course's reviews passed from parent
    setReviews(course.reviews || []);
    setFilteredReviews(course.reviews || []);
  }, [user, course]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get unique user IDs from reviews
        const userIds = course.reviews
          .map((review) => review.user)
          .filter(Boolean);
        
        const uniqueUserIds = [...new Set(userIds)];

        // Batch fetch users
        const users = await Promise.all(
          uniqueUserIds.map(
            (id) => getUserById(id).catch(() => null) // Handle individual errors
          )
        );
        
        // Batch fetch majors
        const temp = await getMajors();
        const majors = await Promise.all(
          temp.map(
            (major) => getMajorById(major.id).catch(() => null)
          )
        );

        // Create username map
        const newUserMap = {};
        users.forEach((user) => {
          if (user?.id) newUserMap[user.id] = user.username;
        });

        // Create major name map
        const newMajorNameMap = {};
        majors.forEach((major) => {
          if (major?.id) {
            newMajorNameMap[major.id] = major.name;
          }
        });
        setMajorNameMap(newMajorNameMap);

        // Create major string map for user
        const newMajorMap = {};
        users.forEach((user) => {
          var majorString = "• Majoring in";
          var count = 0;
          user.major.forEach((major) => {
            if (count != 0) majorString += " +";
            majorString += " " + newMajorNameMap[major];
            count++;
          });
          newMajorMap[user.id] = majorString;
        });
        setMajorMap(newMajorMap);
        
        setUserMap(newUserMap);

        // Calculate available majors for filtering
        const majorsWithReviews = new Set();
        users.forEach(user => {
          if (user?.major) {
            user.major.forEach(majorId => {
              majorsWithReviews.add(majorId);
            });
          }
        });

        const availableMajorsList = Array.from(majorsWithReviews).map(majorId => ({
          id: majorId,
          name: newMajorNameMap[majorId] || `Major ${majorId}`
        }));

        setAvailableMajors(availableMajorsList);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    if (course?.reviews?.length) {
      fetchUserData();
    }
  }, [course.reviews]); // Only re-run when reviews change

  // Memoized filtered reviews with usernames
  const processedReviews = useMemo(() => {
    return filteredReviews.map((review) => ({
      ...review,
      username: review.anon ? "Anonymous" : userMap[review.user],
      major: review.anon ? "" : majorMap[review.user]
    }));
  }, [filteredReviews, userMap]);

  useEffect(() => {
    if (!filterType || !selectedFilter) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter((review) => {
        if (filterType === "semester") {
          return review.semesterTaken === selectedFilter;
        } else if (filterType === "likes") {
          const likes = review.likes || 0;
          if (selectedFilter === "0-2") return likes >= 0 && likes <= 2;
          if (selectedFilter === "3-5") return likes >= 3 && likes <= 5;
          if (selectedFilter === "6-8") return likes >= 6 && likes <= 8;
          if (selectedFilter === "9+") return likes >= 9;
        } else if (filterType === "major") {
          // Filter by major
          const userMajors = getUserById(review.user)?.major || [];
          return userMajors.includes(selectedFilter);
        }
        return true;
      });
      const sortedFiltered = filtered.sort(
        (a, b) => (b.likes || 0) - (a.likes || 0)
      );
      setFilteredReviews(sortedFiltered);
    }
  }, [filterType, selectedFilter, reviews]);

  const handleDeleteClick = (reviewId) => {
    setSelectedReviewId(reviewId);
  };

  const handleDelete = (reviewId) => {
    deleteReview(reviewId)
      .then(() => {
        setReviews(reviews.filter((review) => review.id !== reviewId));
        setFilteredReviews(
          filteredReviews.filter((review) => review.id !== reviewId)
        );
        setSelectedReviewId(null);
        refreshCourses();
      })
      .catch((err) => console.log("Could not delete review", err));
  };

  const handleEdit = (reviewId) => {
    const reviewToEdit = reviews.find((review) => review.id === reviewId);
    setEditingReview(reviewToEdit);
    console.log(editingReview);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleReviewSubmit = (reviewData) => {
    if (editingReview) {
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
      addReview(reviewData, courseId, user.id)
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

  const handleReportClick = (reviewId) => {
    setReportingReview(reviewId);
    setReportId(reviewId)
    setReportReason("");
    setReportDetails("");
  };

  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const handleReportSubmit = () => {
    if (!reportReason) return;
    setIsReporting(true);
    console.log("Reason",reportReason)
    console.log("Details",reportDetails)
    reportReview(reportId, reportDetails, reportReason)
    setTimeout(() => {
      setReportingReview(null);
      setIsReporting(false);
      setShowReportSuccess(true);
      setTimeout(() => setShowReportSuccess(false), 3000); // Hide after 3 seconds
    }, 1000);
  };

  const handleCancelReport = () => {
    setReportingReview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Success message for reports */}
      {showReportSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            <span>Report submitted! This review is under investigation.</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="mb-8 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {course.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {course.department} {course.number}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1 text-gray-900 dark:text-white">
                {course.avgEnjoyment?.toFixed(1) || "N/A"} out of 5
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Based on {filteredReviews.length} reviews
              {filteredReviews.length !== reviews.length &&
                ` (filtered from ${reviews.length})`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <select
            value={filterType || ""}
            onChange={(e) => {
              setFilterType(e.target.value || null);
              setSelectedFilter(null);
            }}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="" className="dark:text-white">
              Filter by...
            </option>
            <option value="semester" className="dark:text-white">
              Semester Taken
            </option>
            <option value="likes" className="dark:text-white">
              Number of Likes
            </option>
            <option value="major" className="dark:text-white">
              Major
            </option>
          </select>

          {filterType && (
            <select
              value={selectedFilter || ""}
              onChange={(e) => setSelectedFilter(e.target.value || null)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">
                Select {filterType === "semester" ? "semester" : 
                       filterType === "likes" ? "likes range" : 
                       "major"}...
              </option>
              {filterType === "semester" ? semesterOptions.map((option) => (
                <option key={option} value={option} className="dark:text-white">
                  {option}
                </option>
              )) : 
               filterType === "likes" ? likesOptions.map((option) => (
                <option key={option} value={option} className="dark:text-white">
                  {option}
                </option>
              )) : 
               availableMajors.map((major) => (
                <option key={major.id} value={major.id} className="dark:text-white">
                  {major.name}
                </option>
              ))}
            </select>
          )}

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
        
        {/* List of reviews */}
        <div className="flex-column space-y-6">
          {processedReviews.map((review) => (
            <div
              className="group relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-md transition-shadow"
              key={review.id}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white"
                  onClick={() => navigate(`/user/${review.username}`)}>
                    {review.username} {review.major}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()} •{" "}
                    {review.semesterTaken}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray-900 dark:text-white">
                      {review.enjoyment || 0}
                    </span>
                  </div>

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
                              e.stopPropagation();
                              setSelectedReviewId(null);
                            }}
                            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(review.id);
                            }}
                            className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {currentUser?.id && (
                      <button
                        onClick={() => handleReportClick(review.id)}
                        className="p-1 hover:text-orange-500 transition-colors cursor-pointer"
                        title="Report this review"
                      >
                        <Flag className="w-5 h-5" />
                        <span className="sr-only">Report</span>
                      </button>
                    )}
                    {currentUser?.id && review.user === currentUser.id && (
                      <button
                        onClick={() => handleEdit(review.id)}
                        className="p-1 hover:text-blue-500 transition-colors cursor-pointer"
                        title="Edit this review"
                      >
                        <Pencil className="w-5 h-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                    )}
                    {currentUser?.id && review.user === currentUser.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(review.id);
                        }}
                        className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete this review"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

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

              {editingReview != null && editingReview.id === review.id && (
                <BaseReviewForm
                  initialData={editingReview}
                  onSubmit={handleReviewSubmit}
                  onCancel={handleCancelEdit}
                  submitButtonText="Update Review"
                />
              )}
            </div>
          ))}

          {reportingReview && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Report Review
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Please select a reason for reporting this review
                </p>

                <div className="mt-4 space-y-4">
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a reason...</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="false_info">False information</option>
                    <option value="spam">Spam</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="harassment">Harassment or bullying</option>
                    <option value="other">Other</option>
                  </select>

                  {reportReason && (
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Additional details (optional)"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  )}
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCancelReport}
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportSubmit}
                    disabled={!reportReason || isReporting}
                    className="w-full bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isReporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

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
