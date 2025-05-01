import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const StarRating = ({ initialRating = 0, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  // Reset when initialRating changes
  useEffect(() => {
    setSelectedRating(initialRating);
  }, [initialRating]);

  const handleClick = (rating) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  return (
    <div className="flex items-center space-x-2 justify-evenly">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleClick(star)}
            className="relative transition-transform duration-200 hover:scale-110 cursor-pointer"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hoverRating || selectedRating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300 dark:text-gray-600"
              } transition-all duration-300 ease-in-out`}
            />
          </button>
        ))}
      </div>
      <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[2rem] flex-shrink-0 text-center">
        {selectedRating}/5
      </span>
    </div>
  );
};
export default StarRating;