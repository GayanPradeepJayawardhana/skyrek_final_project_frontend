import { useState } from "react";
import { FiStar } from "react-icons/fi";

/**
 * StarRating
 * props:
 *  - value: number (0-5)
 *  - onChange: (value) => void — omit for read-only
 *  - size: number (px) — default 16
 *  - showValue: boolean — show "4.5" text next to stars
 *  - count: number — review count text
 */
export default function StarRating({
    value = 0,
    onChange,
    size = 16,
    showValue = false,
    count = null,
}) {
    const [hover, setHover] = useState(0);
    const readOnly = !onChange;
    const displayValue = hover || value;

    return (
        <div className="inline-flex items-center gap-1.5">
            <div
                className="inline-flex items-center gap-0.5"
                onMouseLeave={() => !readOnly && setHover(0)}
            >
                {[1, 2, 3, 4, 5].map((star) => {
                    // full / half / empty
                    const isFull = star <= Math.floor(displayValue);
                    const isHalf =
                        !isFull &&
                        star - 0.5 <= displayValue &&
                        displayValue % 1 >= 0.25 &&
                        displayValue % 1 < 0.75;

                    return (
                        <button
                            key={star}
                            type="button"
                            disabled={readOnly}
                            onMouseEnter={() =>
                                !readOnly && setHover(star)
                            }
                            onClick={() => !readOnly && onChange(star)}
                            className={`transition-transform ${
                                readOnly
                                    ? "cursor-default"
                                    : "cursor-pointer hover:scale-110"
                            }`}
                            aria-label={`${star} star`}
                        >
                            <StarIcon
                                size={size}
                                filled={isFull}
                                half={isHalf}
                            />
                        </button>
                    );
                })}
            </div>

            {showValue && value > 0 && (
                <span className="text-xs text-gray-600 font-semibold">
                    {Number(value).toFixed(1)}
                </span>
            )}

            {count !== null && (
                <span className="text-xs text-gray-500">
                    ({count})
                </span>
            )}
        </div>
    );
}

function StarIcon({ size, filled, half }) {
    if (half) {
        return (
            <div
                className="relative"
                style={{ width: size, height: size }}
            >
                {/* outline */}
                <FiStar
                    size={size}
                    className="text-gray-300 absolute top-0 left-0"
                    strokeWidth={2}
                />
                {/* half fill */}
                <div
                    className="overflow-hidden absolute top-0 left-0"
                    style={{ width: size / 2, height: size }}
                >
                    <FiStar
                        size={size}
                        className="text-amber-400"
                        fill="currentColor"
                        strokeWidth={2}
                    />
                </div>
            </div>
        );
    }

    return (
        <FiStar
            size={size}
            className={
                filled ? "text-amber-400" : "text-gray-300"
            }
            fill={filled ? "currentColor" : "none"}
            strokeWidth={2}
        />
    );
}