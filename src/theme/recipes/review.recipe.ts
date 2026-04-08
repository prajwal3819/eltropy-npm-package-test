import { defineRecipe } from '@chakra-ui/react';
import { colors } from '../tokens/colors';

export const reviewRecipe = defineRecipe({
  className: 'review',
  base: {
    display: 'inline-flex',
    alignItems: 'center',

    '& [data-part="item"] [data-highlighted] [data-fg]': {
      color: colors.yellow[200] + ' !important'
    },

    '& [data-part="item"] [data-bg]': {
      color: colors.gray[400] + ' !important'
    },

    '& .review-value': {
      color: colors.navyGray[700] + ' !important',
      fontWeight: 'medium'
    }
  },
  variants: {
    variant: {
      default: {
        gap: '12px'
      },
      compact: {
        gap: '8px'
      },
      rated: {
        gap: '4px',
        bg: colors.yellow[50],
        color: colors.yellow[900],
        px: '8px',
        py: '4px',
        borderRadius: '8px',
        '& .review-value': {
          color: colors.yellow[900]
        }
      }
    },
    size: {
      sm: {
        '& .review-value': {
          fontSize: '10px'
        }
      },
      md: {
        '& .review-value': {
          fontSize: '12px'
        }
      },
      lg: {
        '& .review-value': {
          fontSize: '14px'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
});
