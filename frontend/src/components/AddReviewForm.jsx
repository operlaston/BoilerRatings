import { useState } from "react";
import BaseReviewForm from "./BaseReviewForm";

export const AddReviewForm = ({ canAddReview, onSubmit, instructorOptions}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!canAddReview) return null;

  return (
    <BaseReviewForm
      onSubmit={async (data) => {
        setIsSubmitting(true);
        await onSubmit(data);
        setIsSubmitting(false);
      }}
      isSubmitting={isSubmitting}
      submitButtonText="Submit Review"
      instructorOptions={instructorOptions}
    />
  );
};
export default AddReviewForm;
