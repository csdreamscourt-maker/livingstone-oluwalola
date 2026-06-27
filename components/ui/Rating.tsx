'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingProps {
  maxStars?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  initialRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({
  maxStars = 5,
  onRate,
  readOnly = false,
  initialRating = 0,
  size = 'md',
}: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(initialRating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleRate = (value: number) => {
    if (!readOnly) {
      setRating(value);
      onRate?.(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const starRating = index + 1;
        const displayRating = readOnly ? rating : hoverRating || rating;
        const isFilled = starRating <= displayRating;

        return (
          <button
            key={index}
            onClick={() => handleRate(starRating)}
            onMouseEnter={() => !readOnly && setHoverRating(starRating)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
            className={`transition-all duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-gold-600 text-gold-600'
                  : 'text-gray-300'
              } transition-all duration-200`}
            />
          </button>
        );
      })}
    </div>
  );
}
