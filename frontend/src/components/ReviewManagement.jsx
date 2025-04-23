import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getReviews, deleteReview } from '../services/review.service'; // Assuming you have this service

function ReviewItem({ review, onDelete }) {
  return (
    <div className="bg-gray-700 rounded-md p-4 mb-2 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold">{review.course?.name || 'Unknown Course'}</p>
        <p className="text-gray-400">{review.comment.substring(0, 50)}...</p>
        <small className="text-gray-500">By: {review.user?.username || 'Anonymous'}</small>
      </div>
      <button onClick={() => onDelete(review.id)} className="text-red-500 hover:text-red-400">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews.');
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (err) {
        console.error('Error deleting review:', err);
        setError('Failed to delete review.');
      }
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const courseName = review.course?.name || '';
    const comment = review.comment || '';
    const username = review.user?.username || '';
    const searchLower = searchQuery.toLowerCase();
    return (
      courseName.toLowerCase().includes(searchLower) ||
      comment.toLowerCase().includes(searchLower) ||
      username.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="text-white">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search reviews..."
        className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Review List</h3>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewItem key={review.id} review={review} onDelete={handleDeleteReview} />
          ))
        ) : (
          <p className="text-gray-400">No reviews match your search.</p>
        )}
      </div>
    </div>
  );
}

export default ReviewManagement;