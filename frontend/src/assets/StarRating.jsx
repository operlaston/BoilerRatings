import { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

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
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleClick(star)}
            className="relative transition-transform duration-200 hover:scale-110"
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
        {selectedRating || "0"}/5
      </span>
    </div>
  );
};
export default StarRating;