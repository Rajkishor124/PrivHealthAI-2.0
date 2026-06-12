import { useState } from 'react';
import { Star } from 'lucide-react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const StarRatingInput = ({ value, onChange, disabled }: Props) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          onMouseEnter={() => !disabled && setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 disabled:cursor-not-allowed transition-transform hover:scale-110"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            className={`h-7 w-7 transition-colors ${
              n <= active
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
