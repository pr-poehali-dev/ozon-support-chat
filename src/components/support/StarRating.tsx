import { useState } from "react";

interface StarRatingProps {
  value: number | null;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={readonly}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => onChange && onChange(star)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L12.09 7.26L17.8 7.27L13.45 10.87L15.18 16.2L10 13L4.82 16.2L6.55 10.87L2.2 7.27L7.91 7.26L10 2Z"
              fill={(hovered || value || 0) >= star ? "#f59e0b" : "none"}
              stroke={(hovered || value || 0) >= star ? "#f59e0b" : "#cbd5e1"}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}
