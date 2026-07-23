import { useState } from 'react';
import Button from './Button';

export default function RatingInput({ value, onSubmit, loading }) {
  const [rating, setRating] = useState(value || 0);
  const [hover, setHover] = useState(0);

  const handleSubmit = () => {
    if (rating >= 1 && rating <= 5) {
      onSubmit(rating);
    }
  };

  return (
    <div className="rating-input">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= (hover || rating) ? 'star--active' : ''}`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            ★
          </button>
        ))}
      </div>
      <Button size="sm" onClick={handleSubmit} loading={loading} disabled={rating < 1}>
        {value ? 'Update' : 'Submit'}
      </Button>
    </div>
  );
}
