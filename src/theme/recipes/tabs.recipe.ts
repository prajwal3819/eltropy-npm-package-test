import { defineSlotRecipe } from '@chakra-ui/react';

export const tabsRecipe = defineSlotRecipe({
  className: 'tabs',
  slots: ['root', 'tablist', 'tab', 'indicator', 'badge'],
  base: {
    tablist: {
      display: 'flex',
      borderBottom: '1px solid',
      borderColor: 'gray.200'
    },
    tab: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      fontSize: '14px',
      fontWeight: 'medium',
      color: 'gray.400',
      cursor: 'pointer',
      transition: 'all 0.2s',
      borderBottom: '2px solid transparent',
      marginBottom: '-1px',
      _hover: {
        bg: 'gray.50',
        color: 'gray.600'
      },
      _selected: {
        color: 'navyGray.700',
        fontWeight: 'bold',
        borderBottomColor: 'navyGray.700',
        _hover: {
          bg: 'transparent'
        }
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'navyGray.300',
        outlineOffset: '0px'
      },
      _disabled: {
        bg: 'gray.200',
        color: 'gray.400',
        cursor: 'not-allowed',
        borderBottomColor: 'transparent',
        _hover: {
          bg: 'gray.200',
          color: 'gray.400'
        },
        '& .tab-badge': {
          bg: 'gray.200',
          color: 'gray.400'
        }
      }
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'orange.200',
      color: 'base.white',
      fontSize: '10px',
      fontWeight: 'regular',
      borderRadius: '100px',
      px: '4px',
      py: '2px',
      minW: '16px',
      h: '16px',
      lineHeight: 1,
      transition: 'all 0.2s'
    },
    indicator: {
      display: 'none' // We are relying purely on border-bottom logic for stability
    }
  },
  variants: {
    variant: {
      line: {},
      enclosed: {
        tablist: {
          gap: '4px',
          borderBottom: 'none'
        },
        tab: {
          border: '1px solid',
          borderColor: 'transparent',
          borderBottomColor: 'gray.100',
          borderTopRadius: '12px',
          marginBottom: '0',
          _selected: {
            bg: 'white',
            borderColor: 'gray.100',
            borderBottomColor: 'transparent'
          }
        }
      }
    },
    size: {
      sm: {
        tab: {
          fontSize: '12px',
          px: '16px',
          py: '12px'
        }
      },
      md: {
        tab: {
          fontSize: '14px',
          px: '24px',
          py: '16px'
        }
      },
      lg: {
        tab: {
          fontSize: '16px',
          px: '32px',
          py: '20px'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'line',
    size: 'md'
  }
});
