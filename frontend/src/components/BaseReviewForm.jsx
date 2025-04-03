import { useState, useEffect } from "react";
import StarRating from "../assets/StarRating.jsx";
import { Loader2, Star } from "lucide-react";

const BaseReviewForm = ({
  initialData = {
    semesterTaken: "",
    reviewContent: "",
    recommend: false,
    anon: false,
    difficulty: 0,
    enjoyment: 0,
    instructor: "",
  },
  onSubmit,
  isSubmitting = false,
  onCancel,
  submitButtonText = "Submit Review",
  instructorOptions,
}) => {
  // Initialize state
  const [formData, setFormData] = useState(() => ({
    ...initialData,
    semesterTaken: initialData.semesterTaken || "",
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    await onSubmit({
      ...formData,
      // Preserve existing metadata when editing
      id: initialData.id,
      likes: initialData.likes || 0,
      reports: initialData.reports || [],
      date: initialData.date || new Date().toISOString(),
    });

    // Auto-reset only for new reviews
    if (!initialData.id) {
      setFormData({
        semesterTaken: "",
        reviewContent: "",
        recommend: false,
        anon: false,
        difficulty: 0,
        enjoyment: 0,
        instructor: null,
      });
    }
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm mt-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Semester Taken Dropdown */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Semester Taken *
          </label>
          <select
            value={formData.semesterTaken}
            onChange={(e) =>
              setFormData({ ...formData, semesterTaken: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
            required
          >
            <option value="">Select Semester</option>
            {[...Array(10)].map((_, i) => {
              const year = 2023 + Math.floor(i / 4);
              const season = ["Winter", "Spring", "Summer", "Fall"][i % 4];
              return (
                <option key={`${season}-${year}`} value={`${season} ${year}`}>
                  {season} {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Instructor Dropdown */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Instructor
          </label>
          <select
            value={formData.instructor ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, instructor: e.target.value })
            }
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">Select Instructor</option>
            {console.log(instructorOptions)}
            {instructorOptions.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Rating */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Course Difficulty
          </label>
          <StarRating
            key={`difficulty-${initialData.id || "new"}`}
            initialRating={formData.difficulty}
            onRatingChange={(rating) =>
              setFormData({ ...formData, difficulty: rating })
            }
          />
        </div>

        {/* Enjoyment Rating */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Enjoyment
          </label>
          <StarRating
            key={`enjoyment-${initialData.id || "new"}`}
            initialRating={formData.enjoyment}
            onRatingChange={(rating) =>
              setFormData({ ...formData, enjoyment: rating })
            }
          />
        </div>

        {/* Recommendation Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recommend"
            checked={formData.recommend}
            onChange={(e) =>
              setFormData({ ...formData, recommend: e.target.checked })
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

        {/* Anonymous Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="anon"
            checked={formData.anon}
            onChange={(e) =>
              setFormData({ ...formData, anon: e.target.checked })
            }
            className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
          />
          <label
            htmlFor="anon"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Would you like this review to be anonymous?
          </label>
        </div>

        {/* Review Text */}
        <textarea
          value={formData.reviewContent || ""}
          onChange={(e) =>
            setFormData({ ...formData, reviewContent: e.target.value })
          }
          placeholder="Leave a review... (20 characters minimum)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white/90 dark:bg-gray-800/80 placeholder-gray-400 dark:placeholder-gray-100 
                focus:outline-none focus:ring-2 focus:ring-orange-500 
                text-gray-900 dark:text-gray-200 resize-none transition-all duration-200"
          rows={4}
          required
          disabled={isSubmitting}
        />

        {/* Action Buttons */}
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.semesterTaken ||
              formData.difficulty === 0 ||
              formData.enjoyment === 0 ||
              formData.reviewContent.trim().length < 20 ||
              !formData.instructor
            }
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 
                    p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors 
                    disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {submitButtonText.replace("Review", "ing...")}
              </>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BaseReviewForm;
