import { chakra, RatingGroup } from '@chakra-ui/react';
import { forwardRef, useState, useEffect } from 'react';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { reviewRecipe } from '../../theme/recipes/review.recipe';

const BaseReview = chakra('div', reviewRecipe);

export interface ReviewProps extends HTMLChakraProps<'div'> {
  variant?: 'default' | 'compact' | 'rated';
  size?: 'sm' | 'md' | 'lg';
  rating?: number;
  defaultValue?: number;
  maxRating?: number;
  showValue?: boolean;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const Review = forwardRef<HTMLDivElement, ReviewProps>(
  (
    {
      variant = 'default',
      size = 'md',
      rating,
      defaultValue = 0,
      maxRating = 5,
      showValue = false,
      readonly = false,
      onRatingChange,
      children,
      ...props
    },
    ref
  ) => {
    // currentRating will now strictly be a number
    const [currentRating, setCurrentRating] = useState<number>(
      rating ?? defaultValue
    );

    useEffect(() => {
      if (typeof rating === 'number') {
        setCurrentRating(rating);
      }
    }, [rating]);

    // strictly accepts a number, no objects allowed
    const handleValueChange = (newValue: number) => {
      if (rating === undefined) {
        setCurrentRating(newValue);
      }
      onRatingChange?.(newValue);
    };

    if (variant === 'rated') {
      return (
        <BaseReview ref={ref} variant={variant} size={size} {...props}>
          <chakra.svg
            width="12px"
            height="12px"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M5.56664 0.196454C5.68461 -0.0654849 6.05654 -0.0654847 6.17451 0.196454L7.71484 3.61668L11.4437 4.02471C11.7292 4.05596 11.8442 4.40969 11.6315 4.60283L8.85465 7.12468L9.61886 10.7971C9.67739 11.0783 9.37649 11.297 9.12709 11.1544L5.87057 9.29274L2.61406 11.1544C2.36466 11.297 2.06376 11.0783 2.12229 10.7971L2.88649 7.12468L0.109654 4.60283C-0.103011 4.40969 0.0119221 4.05596 0.297495 4.02471L4.02631 3.61668L5.56664 0.196454Z"
              fill="#5C4A0A"
            />
          </chakra.svg>
          <chakra.span className="review-value">
            {currentRating}/{maxRating}
          </chakra.span>
          {children}
        </BaseReview>
      );
    }

    return (
      <BaseReview ref={ref} variant={variant} size={size} {...props}>
        <RatingGroup.Root
          allowHalf
          count={maxRating}
          value={currentRating}
          size={size}
          disabled={readonly}
          onValueChange={
            !readonly
              ? (details) => {
                  // Safely extract the number whether Chakra passes { value: 4 } or just 4
                  const extractedValue =
                    typeof details === 'number' ? details : details?.value;
                  if (typeof extractedValue === 'number') {
                    handleValueChange(extractedValue);
                  }
                }
              : undefined
          }
        >
          <RatingGroup.HiddenInput />
          <RatingGroup.Control />
        </RatingGroup.Root>

        {showValue && (
          <chakra.span className="review-value">
            {currentRating}/{maxRating}
          </chakra.span>
        )}
        {children}
      </BaseReview>
    );
  }
);

Review.displayName = 'Review';
