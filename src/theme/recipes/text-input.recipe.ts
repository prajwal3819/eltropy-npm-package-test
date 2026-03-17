import { defineSlotRecipe } from '@chakra-ui/react';

export const textInputRecipe = defineSlotRecipe({
  slots: [
    'root',
    'input',
    'label',
    'subtext',
    'supportingText',
    'iconContainer'
  ],
  className: 'text-input',
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      minWidth: '200px'
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
      _dark: {
        bg: 'gray.950',
        color: 'white',
        borderColor: 'gray.900'
      },
      _placeholder: {
        color: 'gray.400',
        _dark: {
          color: 'gray.300'
        }
      },
      _focus: {
        borderColor: 'navyGray.200',
        borderWidth: '2px',
        zIndex: 1,
        _dark: {
          borderColor: 'navyGray.200'
        }
      },
      '&:hover:not(:focus)': {
        borderColor: 'gray.200',
        _disabled: {
          borderColor: 'gray.200',
          color: 'gray.500'
        },
        _dark: {
          borderColor: 'gray.900',
          _disabled: {
            borderColor: 'gray.900'
          }
        }
      },
      '&[data-invalid]': {
        borderColor: 'red.200',
        bg: 'red.50',
        _focus: {
          borderColor: 'red.200',
          borderWidth: '2px'
        },
        _hover: {
          borderColor: 'red.200'
        },
        _dark: {
          borderColor: 'red.200',
          bg: 'red.50'
        }
      },
      _disabled: {
        bg: 'gray.200',
        borderColor: 'gray.200',
        color: 'gray.500',
        cursor: 'not-allowed',
        opacity: 1,
        _hover: {
          borderColor: 'gray.200'
        },
        _dark: {
          bg: 'gray.300',
          borderColor: 'gray.900',
          color: 'gray.400',
          _hover: {
            borderColor: 'gray.900'
          }
        }
      }
    },
    label: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: 'navyGray.700',
      _dark: {
        color: 'white'
      }
    },
    subtext: {
      fontSize: 'xs',
      color: 'gray.600',
      _dark: {
        color: 'gray.300'
      }
    },
    supportingText: {
      fontSize: 'xs',
      color: 'gray.600',
      _dark: {
        color: 'gray.300'
      }
    },
    iconContainer: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      borderRadius: '4px'
    }
  },
  variants: {
    size: {
      sm: {
        input: {
          h: '32px',
          fontSize: '12px',
          borderRadius: '8px',
          px: '12px'
        }
      },
      md: {
        input: {
          h: '40px',
          fontSize: '14px',
          borderRadius: '12px',
          px: '12px'
        }
      },
      lg: {
        input: {
          h: '48px',
          fontSize: '16px',
          borderRadius: '12px',
          px: '12px'
        }
      }
    },
    hasLeftIcon: {
      true: {}
    },
    hasRightIcon: {
      true: {}
    }
  },
  compoundVariants: [
    { size: 'sm', hasLeftIcon: true, css: { input: { pl: '32px' } } },
    { size: 'md', hasLeftIcon: true, css: { input: { pl: '40px' } } },
    { size: 'lg', hasLeftIcon: true, css: { input: { pl: '44px' } } },
    { size: 'sm', hasRightIcon: true, css: { input: { pr: '32px' } } },
    { size: 'md', hasRightIcon: true, css: { input: { pr: '40px' } } },
    { size: 'lg', hasRightIcon: true, css: { input: { pr: '44px' } } }
  ],
  defaultVariants: {
    size: 'md'
  }
});
