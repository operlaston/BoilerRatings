import BaseReviewForm from "./BaseReviewForm";

export const EditReviewForm = ({ review, onSubmit, onCancel }) => (
    <BaseReviewForm
      initialData={review}
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitButtonText="Update Review"
    />
  );