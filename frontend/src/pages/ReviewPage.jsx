import StarRating from "../assets/StarRating.jsx"
const ReviewPage = () => {
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
            {/* Add a review  */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Add a review:
              </h3>
              <div className="flex items-center space-x-1">
                <StarRating  />
              </div>
            </div>
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
