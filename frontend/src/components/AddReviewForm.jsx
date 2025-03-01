import { useState } from "react";
import StarRating from "../assets/StarRating.jsx";
import { Loader2, Star } from "lucide-react";

const AddReviewForm = ({ onSubmit, canAddReview }) => {
  const [reviewData, setReviewData] = useState({
    semesterTaken: "",
    reviewContent: "",
    recommend: false,
    difficulty: 0,
    enjoyment: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSubmit(reviewData);
      setReviewData({
        semesterTaken: "",
        reviewContent: "",
        recommend: false,
        difficulty: 0,
        enjoyment: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!canAddReview) return null;

  return (
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
            <option value="Winter 2024">Winter 2024</option>
            <option value="Spring 2024">Spring 2024</option>
            <option value="Summer 2024">Summer 2024</option>
            <option value="Fall 2024">Fall 2024</option>
            <option value="Winter 2025">Winter 2025</option>
            <option value="Spring 2025">Spring 2025</option>
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
  );
};

export default AddReviewForm;
