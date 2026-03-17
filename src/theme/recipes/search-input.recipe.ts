import { defineSlotRecipe } from '@chakra-ui/react';

export const searchInputRecipe = defineSlotRecipe({
  slots: ['root', 'input', 'iconContainer', 'searchIcon', 'clearIcon'],
  className: 'search-input',
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    input: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.2s',
      outline: 'none',
      bg: 'white',
      color: 'navyGray.700',
      borderWidth: '1px',
      borderColor: 'gray.200',
      _placeholder: {
        color: 'gray.400'
      },
      _hover: {
        borderColor: 'successGreen.200',
        borderWidth: '2px',
        bg: 'gray.50'
      },
      _focus: {
        borderColor: 'navyGray.300',
        borderWidth: '2px',
        bg: 'white',
        zIndex: 1
      },
      '&[data-invalid]': {
        borderColor: 'red.200',
        bg: 'red.50',
        _focus: {
          borderColor: 'red.200',
          borderWidth: '1px',
          bg: 'red.50'
        },
        _hover: {
          borderColor: 'red.200',
          borderWidth: '1px',
          bg: 'red.50'
        }
      },
      _disabled: {
        bg: 'gray.200',
        borderColor: 'gray.200',
        color: 'gray.400',
        cursor: 'not-allowed',
        opacity: 1,
        _hover: {
          borderColor: 'gray.200',
          borderWidth: '1px',
          bg: 'gray.200'
        }
      }
    },
    iconContainer: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2
    },
    searchIcon: {
      color: 'gray.400',
      transition: 'color 0.2s ease-in-out',
      '&[data-focus]': {
        color: 'navyGray.700'
      },
      '&[data-hover]': {
        color: 'navyGray.700'
      },
      _disabled: {
        color: 'gray.400'
      }
    },
    clearIcon: {
      color: 'navyGray.700',
      cursor: 'pointer',
      transition: 'color 0.2s ease-in-out',
      _hover: {
        color: 'navyGray.700'
      },
      _disabled: {
        color: 'gray.400'
      }
    }
  },
  variants: {
    size: {
      sm: {
        input: {
          h: '32px',
          fontSize: '12px',
          borderRadius: '8px',
          px: '32px'
        },
        searchIcon: {
          width: '16px',
          height: '16px'
        },
        clearIcon: {
          width: '16px',
          height: '16px'
        }
      },
      md: {
        input: {
          h: '40px',
          fontSize: '14px',
          borderRadius: '12px',
          px: '40px'
        },
        searchIcon: {
          width: '20px',
          height: '20px'
        },
        clearIcon: {
          width: '20px',
          height: '20px'
        }
      },
      lg: {
        input: {
          h: '48px',
          fontSize: '16px',
          borderRadius: '12px',
          px: '44px'
        },
        searchIcon: {
          width: '24px',
          height: '24px'
        },
        clearIcon: {
          width: '24px',
          height: '24px'
        }
      }
    },
    hasRightIcon: {
      true: {
        input: {
          pr: '40px'
        }
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
});
