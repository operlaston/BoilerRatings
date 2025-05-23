import { useState, useEffect, useMemo, use } from "react";
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
  Ban,
} from "lucide-react";
import {
  addReview,
  likeReview,
  dislikeReview,
  editReview,
  deleteReview,
  reportReview,
  getReviewsForACourse,
} from "../services/review.service.js";
import { getMajorById, getMajors } from "../services/major.service.js";
import { getUserById, getUserByUsername, flagUser } from "../services/user.service.js";
import { getCourseByName, getCourses } from "../services/course.service.js";
function ReportFormModal({ isOpen, onClose, onSubmit, reason, setReason }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
  {/* Background overlay click to close */}
  <div
    className="absolute inset-0 z-0"
    onClick={onClose}
  />

  {/* Modal content */}
  <div className="relative z-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Flag User
    </h2>
    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
      Please enter a reason for flagging this user:
    </p>
    <textarea
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder="Write your reason here..."
      rows={4}
      className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
    />
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
      <button
        onClick={() => {
          onSubmit();
          onClose();
        }}
        className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 rounded-lg"
      >
        Submit Report
      </button>
    </div>
  </div>
</div>
  );
}

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
  const [reportId, setReportId] = useState(null);

  const [userMap, setUserMap] = useState({});
  const [majorMap, setMajorMap] = useState({});
  const [majorNameMap, setMajorNameMap] = useState({});

  const currentUser = user ?? {};
  const courseId = course.id;
  const [reviews, setReviews] = useState(course.reviews || []);
  const [filterType, setFilterType] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState(course.reviews || []);
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [flaggedReview, setFlagedReview] = useState(null);
  const [reviewersById, setReviewersById] = useState({});



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
  //console.log(course)

  const instructorOptions = course.instructors
  // console.log(instructorOptions)

  const likesOptions = ["negative", "0-2", "3-5", "6-8", "9+"];

  useEffect(() => {
    const timeCheck = new Date(course.timeToReview).getTime() < new Date(Date.now()).getTime()
    if (user && timeCheck) {
      setCanAddReview(true);
    }
    setReviews(course.reviews || []);
    setFilteredReviews(course.reviews || []);
  }, [user, course]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIds = course.reviews
          .map((review) => review.user)
          .filter(Boolean);
        const uniqueUserIds = [...new Set(userIds)];
  
        const users = await Promise.all(
          uniqueUserIds.map((id) => getUserById(id).catch(() => null))
        );
  
        // Get all unique major IDs from reviewers of this course
        const courseMajorIds = new Set();
        const newUserMajorMap = {};
        
        users.forEach((user) => {
          if (user?.id) {
            newUserMajorMap[user.id] = user.major || [];
            user.major?.forEach(majorId => courseMajorIds.add(majorId));
          }
        });
  
        // Now fetch ONLY the majors that appear in these reviews
        const allMajors = await getMajors();
        const relevantMajors = allMajors.filter(major => 
          courseMajorIds.has(major.id)
        );
  
        // Create major name mapping only for relevant majors
        const newMajorNameMap = {};
        relevantMajors.forEach(major => {
          newMajorNameMap[major.id] = major.name;
        });
  
        setMajorNameMap(newMajorNameMap);
        setMajorMap(newUserMajorMap);
  
        // Create display map for usernames
        const newUserMap = {};
        users.forEach((user) => {
          if (user?.id) {
            newUserMap[user.id] = user.username;
          }
        });
        setUserMap(newUserMap);
  
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
  
    if (course?.reviews?.length) {
      fetchUserData();
    }
  }, [course.reviews]);

  const processedReviews = useMemo(() => {
    return filteredReviews
      .filter(review => review.reports?.length < 3 || currentUser?.isAdmin)
      .map((review) => {
        const majors = review.anon ? [] : (majorMap[review.user] || []);
        const majorNames = majors.map(id => majorNameMap[id]).filter(Boolean);
        
        return {
          ...review,
          username: review.anon ? "Anonymous" : (
            userMap[review.user] || 
            (review.user === currentUser?.id ? currentUser.username : "[deleted]")
          ),
          majorDisplay: majorNames.length > 0 
            ? `• ${majorNames.join(" + ")}` 
            : ""
        };
      });
  }, [filteredReviews, userMap, majorMap, majorNameMap, currentUser?.isAdmin]);
  useEffect(() => {
    const loadReviewers = async () => {
      const uniqueUserIds = [...new Set(processedReviews.map(r => r.user))];
      const users = await Promise.all(uniqueUserIds.map(id => getUserById(id)));
      const lookup = {};
      users.forEach(user => {
        lookup[user.id] = user;
      });
      setReviewersById(lookup);
    };
  
    loadReviewers();
  }, [processedReviews]);

  useEffect(() => {
    if (!user) {
      return;
    }
    getUserByUsername(user.username).then((newUser) => {
      setUser(newUser)
    })
    .catch(e => console.error('could not retrieve user'))
  }, [])

  useEffect(() => {
    if (!filterType || !selectedFilter) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter((review) => {
        const likes = review.likes || 0;
        
        if (filterType === "semester") {
          return review.semesterTaken === selectedFilter;
        } else if (filterType === "likes") {
          switch (selectedFilter) {
            case "negative": return likes < 0;
            case "0-2": return likes >= 0 && likes <= 2;
            case "3-5": return likes >= 3 && likes <= 5;
            case "6-8": return likes >= 6 && likes <= 8;
            case "9+": return likes >= 9;
            default: return true;
          }
        } else if (filterType === "major") {
          try {
            const userMajors = majorMap[review.user] || [];
            return userMajors.includes(selectedFilter);
          } catch (err) {
            console.error("Major filter error:", err);
            return false;
          }
        } else if (filterType === "instructor") {
          if (review.instructor === undefined) {
            return false;
          }
          return review.instructor.id === selectedFilter;
        }
        return true;
      });

      setFilteredReviews(filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0)));
    }
  }, [filterType, selectedFilter, reviews, majorMap]);

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
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleReviewSubmit = (reviewData) => {
    console.log(reviewData)
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
      console.log(reviewData)
      let newReview = addReview(reviewData, courseId, user.id)
        .then((newReview) => {
          newReview.user = user.id;
          setReviews([newReview, ...reviews]);
          setFilteredReviews([newReview, ...filteredReviews]);
          refreshCourses();
        })
        .catch((err) => console.log("Could not add review", err));
    }
  };

  const handleLike = async (reviewId) => {
    try {
      if (!user) return;

      // 1. Get current like count
      const currentReview = reviews.find(r => r.id === reviewId);
      const currentLikes = currentReview?.likes || 0;
      
      // 2. IMMEDIATELY update UI
      // setReviews(prev => prev.map(r => 
      //   r.id === reviewId ? { ...r, likes: currentLikes + 1 } : r
      // ));
      
      // 3. Make API call
      const response = await likeReview(reviewId, user.id);

      setUser(response.newUser)

      // 4. ONLY update if server returned different value
      // if (response?.newReview?.likes !== currentLikes + 1) {
      // setCourses(await getCourses())
      const newCourse = await getCourseByName(course.number)
      const newReviews = newCourse.reviews
      setCourse(newCourse)
      setReviews(newReviews)
      // setReviews(newReviews)
        // setReviews(prev => prev.map(r => 
        //   r.id === reviewId ? { ...r, likes: response.newReview.likes } : r
        // ));
      // }
  
    } catch (err) {
      // 5. Reset to original if error
      // setReviews(prev => prev.map(r => 
      //   r.id === reviewId ? { ...r, likes: currentLikes } : r
      // ));
      console.error("Like error:", err);
    }
  };
  
  const handleDislike = async (reviewId) => {
    if (!user) return;

    // 1. Capture current state
    const currentReview = reviews.find(r => r.id === reviewId);
    const currentLikes = currentReview?.likes || 0;
    
    // setReviews(prev => prev.map(r => 
    //   r.id === reviewId ? { ...r, likes: currentLikes - 1 } : r
    // ));
  
    try {
      // 2. API call
      const { newUser, newReview } = await dislikeReview(reviewId, user.id);
      

      setUser(newUser)

      const newCourse = await getCourseByName(course.number)
      const newReviews = newCourse.reviews
      setCourse(newCourse)
      setReviews(newReviews)
      // 3. Verify server response
      // if (newReview?.likes !== undefined) {
        // setReviews(prev => prev.map(r => 
        //   r.id === reviewId ? { ...r, likes: newReview.likes } : r
        // ));
      // }
    } catch (err) {
      // 4. Rollback on error (increment back)
      // setReviews(prev => prev.map(r => 
      //   r.id === reviewId ? { ...r, likes: currentLikes } : r
      // ));
      console.error("Dislike error:", err);
    }
  };

  const handleReportClick = (reviewId) => {
    setReportingReview(reviewId);
    setReportId(reviewId);
    setReportReason("");
    setReportDetails("");
  };

  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const handleReportSubmit = () => {
    if (!reportReason) return;
    setIsReporting(true);
    console.log("Reason", reportReason);
    console.log("Details", reportDetails);
    reportReview(reportId, reportDetails, reportReason);
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
  const [showFlagModal, setShowFlagModal] = useState(false)
  const handleFlagUser = (userId, reason) => {
    console.log('Flag user:', userId, 'with reason:', reason);
    flagUser(userId, true, reason)
    // Implement flag user logic
  }

  console.log(processedReviews)
  return (
    <div className="min-h-screen">
      {/* Success message for reports */}
      {showReportSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            <span>Report submitted! This review is under investigation.</span>
          </div>
        </div>
      )}
      <div className="max-w-3xl py-8">

        <div className="flex flex-col sm:flex-row gap-4 justify-left items-center mb-6">
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
            <option value="instructor" className="dark:text-white">
              Instructor Taken With
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
                Select{" "}
                {filterType === "semester"
                  ? "semester"
                  : filterType === "likes"
                  ? "likes range"
                  : filterType === "instructor" 
                  ? "instructor"
                  : "major"}
                ...
              </option>
              
              {/* Semester Options */}
              {filterType === "semester" &&
                semesterOptions.map((option) => (
                  <option key={option} value={option} className="dark:text-white">
                    {option}
                  </option>
                ))
              }
              
              {/* Likes Options */}
              {filterType === "likes" &&
                likesOptions.map((option) => (
                  <option key={option} value={option} className="dark:text-white">
                    {option}
                  </option>
                ))
              }
              
              {/* Major Options */}
              {filterType === "major" &&
                Object.entries(majorNameMap).map(([majorId, majorName]) => (
                  <option key={majorId} value={majorId} className="dark:text-white">
                    {majorName}
                  </option>
                ))
              }
              
              {/* Instructor Options */}
              {filterType === "instructor" &&
                instructorOptions.map((pair) => (
                  <option key={pair.id} value={pair.id} className="dark:text-white">
                    {pair.name}
                  </option>
                ))
              }
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
          {processedReviews.length === 0 && filteredReviews.length > 0 && (
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center">
              <p>All reviews for these filters are currently hidden due to reports</p>
          </div>
          )}
          <ReportFormModal
                      isOpen={showFlagModal}
                      onClose={() => setShowFlagModal(false)}
                      onSubmit={() => handleFlagUser(flaggedReview.user, reason)}
                      reason={reason}
                      setReason={setReason}
                      />
          {processedReviews.map((review) => (
            <div
              className="group relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-md transition-shadow"
              key={review.id}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                <h3 className="font-medium text-gray-900 dark:text-white cursor-pointer"
                  onClick={() => (review.username != "[deleted]" && review.username != "Anonymous")? navigate(`/user/${review.username}`) : ""}>
                  {review.username} {review.majorDisplay}
                  {review.instructor?.name && (
                  <>
                  {" • "}{review.instructor.name}
                  {currentUser?.admin && reviewersById[review.user]?.flag && (
                  <span className="text-red-600 ml-2">(Flagged: {reviewersById[review.user].flagReason})</span>
                  )}
                  </>
                  )}
                </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.date).toLocaleDateString()} •{" "}
                    {review.semesterTaken}
                  </p>
                </div>

                <div className="flex items-center gap-4">
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
                        <Flag className="w-5 h-5 dark:text-gray-400" />
                        <span className="sr-only">Report</span>
                      </button>
                    )}
                    {currentUser?.id && currentUser?.admin === true && (
                      <button
                        onClick={() => {
                          setShowFlagModal(true)
                          setFlagedReview(review)}}
                        className="p-1 hover:text-orange-500 transition-colors cursor-pointer"
                        title="Flag This Guy"
                      >
                        <Ban className="w-5 h-5 dark:text-gray-400" />
                        <span className="sr-only">Flag This Guy</span>
                      </button>
                    )}
                    {currentUser?.id && review.user === currentUser.id && (
                      <button
                        onClick={() => handleEdit(review.id)}
                        className="p-1 hover:text-blue-500 transition-colors cursor-pointer"
                        title="Edit this review"
                      >
                        <Pencil className="w-5 h-5 dark:text-gray-400" />
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
                        <Trash2 className="w-5 h-5 dark:text-gray-400" />
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
                fill={user?.likedReviews?.some(r => (r.review === review.id && r.favorability === 1)) 
                  ? "#9CA3AF"
                  : "transparent"}
              />
              <span>{review.likes || 0}</span>
              <ThumbsDown
                className="w-4 h-4 cursor-pointer"
                onClick={() => handleDislike(review.id)}
                fill={user?.likedReviews?.some(r => (r.review === review.id && r.favorability === -1)) 
                  ? "#9CA3AF" 
                  : "transparent"}
              />
              </div>

              {editingReview != null && editingReview.id === review.id && (
                <BaseReviewForm
                  initialData={editingReview}
                  onSubmit={handleReviewSubmit}
                  onCancel={handleCancelEdit}
                  submitButtonText="Update Review"
                  instructorOptions={instructorOptions}
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
              instructorOptions={instructorOptions}
            />
          )}
          {new Date(course.timeToReview).getTime() >= new Date(Date.now()).getTime() && (
            <div className="p-4 gap-4 items-center flex flex-col gap-2 mb-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
              <h1 className="text-md py-2 font-medium text-gray-700 dark:text-gray-300">
                Review creation is not available for this course yet!
              </h1>
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Reviews will become available:
              </h2>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {new Date(course.timeToReview).toDateString()}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
