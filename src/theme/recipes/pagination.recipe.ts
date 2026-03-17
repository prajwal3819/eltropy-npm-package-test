import { defineSlotRecipe } from '@chakra-ui/react';

export const paginationRecipe = defineSlotRecipe({
  className: 'pagination',
  slots: [
    'root',
    'leftSection',
    'rightSection',
    'itemsPerPageContainer',
    'itemsPerPageLabel',
    'itemsPerPageDropdown',
    'itemsPerPageDropdownIcon',
    'goToContainer',
    'goToLabel',
    'goToInput',
    'paginationBase',
    'pageList',
    'pageItem',
    'navButton',
    'navIcon',
    'navText',
    'ellipsis'
  ],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      bg: 'base.white'
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      flexShrink: 0
    },
    itemsPerPageContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    itemsPerPageLabel: {
      fontSize: '14px',
      fontWeight: 'medium',
      color: 'gray.600',
      whiteSpace: 'nowrap'
    },
    itemsPerPageDropdown: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '40px',
      minWidth: '80px',
      paddingX: '12px',
      bg: 'base.white',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.200',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 'regular',
      color: 'navyGray.700',
      cursor: 'pointer',
      _focus: {
        outline: 'none',
        borderColor: 'navyGray.300'
      }
    },
    itemsPerPageDropdownIcon: {
      width: '24px',
      height: '24px',
      flexShrink: 0,
      color: 'gray.600'
    },
    goToContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    goToLabel: {
      fontSize: '14px',
      fontWeight: 'medium',
      color: 'gray.600',
      whiteSpace: 'nowrap'
    },
    goToInput: {
      height: '40px',
      width: '90px',
      paddingX: '12px',
      bg: 'base.white',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.200',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 'regular',
      color: 'navyGray.700',
      _placeholder: {
        color: 'gray.400',
        opacity: 0.9
      },
      _focus: {
        outline: 'none',
        borderColor: 'navyGray.300'
      }
    },
    paginationBase: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    pageList: {
      display: 'flex',
      alignItems: 'center',
      gap: '0'
    },
    pageItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '32px',
      height: '32px',
      paddingX: '12px',
      paddingY: '4px',
      borderRadius: '4px',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 'regular',
      color: 'gray.600',
      cursor: 'pointer',
      bg: 'transparent',
      border: 'none',
      textAlign: 'center',
      whiteSpace: 'nowrap',
      transition: 'all 0.15s ease-in-out',
      _hover: {
        bg: 'gray.50',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'gray.200',
        fontWeight: 'medium',
        color: 'navyGray.700'
      },
      _focus: {
        outline: 'none',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'navyGray.300'
      },
      _focusVisible: {
        outline: 'none',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'navyGray.300'
      }
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '0',
      bg: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease-in-out',
      _focus: {
        outline: 'none'
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'navyGray.300',
        outlineOffset: '2px',
        borderRadius: '4px'
      }
    },
    navIcon: {
      width: '24px',
      height: '24px',
      flexShrink: 0,
      color: 'gray.600',
      transition: 'color 0.15s ease-in-out'
    },
    navText: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 'regular',
      color: 'gray.600',
      transition: 'color 0.15s ease-in-out'
    },
    ellipsis: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '32px',
      height: '32px',
      paddingX: '12px',
      paddingY: '4px',
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 'regular',
      color: 'gray.600'
    }
  },
  variants: {
    pageState: {
      inactive: {
        pageItem: {
          bg: 'transparent',
          borderWidth: '0',
          fontWeight: 'regular',
          color: 'gray.600'
        }
      },
      active: {
        pageItem: {
          bg: 'gray.50',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'gray.200',
          fontWeight: 'medium',
          color: 'navyGray.700',
          _hover: {
            bg: 'gray.50'
          }
        }
      }
    },
    navState: {
      enabled: {
        navIcon: {
          color: 'gray.600'
        },
        navText: {
          color: 'gray.600'
        }
      },
      disabled: {
        navIcon: {
          color: 'gray.300'
        },
        navText: {
          color: 'gray.300'
        }
      }
    }
  },
  defaultVariants: {
    pageState: 'inactive',
    navState: 'enabled'
  }
});
