import { defineRecipe } from '@chakra-ui/react';

export const pinInputRecipe = defineRecipe({
  className: 'pin-input',
  base: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    bg: 'white',
    borderWidth: '1px',
    borderColor: 'gray.200',
    color: 'navyGray.700',
    fontWeight: 'normal',
    textAlign: 'center',
    transition: 'all 0.2s',
    outline: 'none',
    padding: '12px',

    _placeholder: {
      color: 'gray.400'
    },

    _focus: {
      bg: 'gray.50',
      borderColor: 'navyGray.300',
      borderWidth: '2px',
      boxShadow: 'none',
      zIndex: 1
    },

    _invalid: {
      borderColor: 'red.200',
      color: 'navyGray.700',
      bg: 'red.50',
      _focus: {
        borderColor: 'red.200',
        borderWidth: '2px'
      },
      _hover: {
        borderColor: 'red.200'
      }
    },

    _disabled: {
      bg: 'gray.200',
      borderColor: 'gray.200',
      color: 'gray.400',
      cursor: 'not-allowed',
      opacity: 1
    }
  },
  variants: {
    size: {
      sm: {
        w: '32px',
        h: '32px',
        fontSize: '12px',
        borderRadius: '6px'
      },
      md: {
        w: '40px',
        h: '40px',
        fontSize: '14px',
        borderRadius: '8px'
      },
      lg: {
        w: '48px',
        h: '48px',
        fontSize: '16px',
        borderRadius: '12px'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
