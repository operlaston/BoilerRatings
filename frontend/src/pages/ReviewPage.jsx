import { useState } from "react";
import StarRating from "../assets/StarRating.jsx";
import { Loader2 } from "lucide-react";

const ReviewPage = () => {
  // Declare all states inside the component
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    semesterTaken: "",
    reviewContent: "",
    recommend: false,
    difficulty: 0,
    enjoyment: 0, // This was previously called "rating"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastReview, setReview] = useState("");

  // Temporary mock data - replace with real data later
  const mockReviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 4.5,
      text: "This course really helped me understand fundamental concepts. The projects were challenging but rewarding!",
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 3.8,
      text: "Good content but the workload was heavier than expected. Make sure to manage your time well.",
    },
    {
      id: 3,
      name: "Emma Wilson",
      rating: 4.2,
      text: "Excellent professor and well-structured materials. The exams were fair but required thorough preparation.",
    },
  ];

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newReview = {
        semesterTaken: reviewData.semesterTaken,
        reviewContent: reviewData.reviewContent,
        recommend: reviewData.recommend,
        difficulty: reviewData.difficulty,
        enjoyment: reviewData.enjoyment,
        // These would come from actual auth/system:
        user: "placeholder-user-id",
        date: new Date().toISOString(),
        likes: 0,
        reports: [],
      };
      console.log("Submitting review:", newReview);

      // await fetch('/api/reviews', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(newReview)
      // });

      // clear form on success
      setReviewData({
        semesterTaken: "",
        reviewContent: "",
        recommend: false,
        difficulty: 0,
        enjoyment: 0,
      });
      console.log("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center p-4 dark:bg-gray-900 overflow-y-auto">
      {/* Animated background blobs - same style as login page */}
      <div className="absolute top-2/3 w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-1"></div>
      <div className="absolute top-1/4 w-64 h-64 bg-gray-300 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-2"></div>
      <div className="absolute top-1/2 w-52 h-52 bg-gray-200 dark:bg-gray-700 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-2xl opacity-70 animate-blob-3"></div>

      {/* Content Container */}
      <div className="relative w-full max-w-2xl p-6 space-y-6 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl z-10">
        {/* Average Rating Section */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            4.2/5
          </h2>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Based on {mockReviews.length} reviews
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
            >
              {/* Reviewer Header */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {review.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-gray-900 dark:text-white">
                    {review.rating}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 dark:text-gray-300">{review.text}</p>
            </div>
          ))}
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              {/* Semester Taken Dropdown */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Semester Taken *
                </label>
                <select
                  value={reviewData.semesterTaken}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      semesterTaken: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Winter 2023">Winter 2023</option>
                  <option value="Spring 2023">Spring 2023</option>
                  <option value="Summer 2023">Summer 2023</option>
                  <option value="Fall 2023">Fall 2023</option>
                </select>
              </div>

              {/* Difficulty Rating */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course Difficulty
                </label>
                <StarRating
                  onRatingChange={(rating) =>
                    setReviewData({ ...reviewData, difficulty: rating })
                  }
                  currentRating={reviewData.difficulty}
                />
              </div>

              {/* Enjoyment Rating */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Overall Enjoyment
                </label>
                <StarRating
                  onRatingChange={(rating) =>
                    setReviewData({ ...reviewData, enjoyment: rating })
                  }
                  currentRating={reviewData.enjoyment}
                />
              </div>

              {/* Recommendation Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recommend"
                  checked={reviewData.recommend}
                  onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      recommend: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                />
                <label
                  htmlFor="recommend"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Would you recommend this course?
                </label>
              </div>

              {/* Review Text */}
              <textarea
                value={reviewData.reviewContent}
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    reviewContent: e.target.value,
                  })
                }
                placeholder="Leave a review..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white/90 dark:bg-gray-800/80 placeholder-gray-400 dark:placeholder-gray-100 
                focus:outline-none focus:ring-2 focus:ring-orange-500 
                text-gray-900 dark:text-gray-200 resize-none transition-all duration-200"
                rows={4}
                required
                disabled={isLoading}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !reviewData.semesterTaken ||
                  reviewData.difficulty === 0 ||
                  reviewData.enjoyment === 0 ||
                  reviewData.reviewContent.trim().length < 20
                }
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors 
                disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Star icon component (import from lucide-react)
const Star = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
export default ReviewPage;
