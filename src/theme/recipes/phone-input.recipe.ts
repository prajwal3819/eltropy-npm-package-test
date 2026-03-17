import { defineSlotRecipe } from '@chakra-ui/react';

export const phoneInputRecipe = defineSlotRecipe({
  slots: [
    'wrapper',
    'trigger',
    'triggerIcon',
    'divider',
    'dialCode',
    'nativeInput'
  ],
  className: 'phone-input',
  base: {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      gap: '8px',
      padding: '8px',
      borderRadius: '12px',
      border: '1px solid',
      borderColor: 'gray.200',
      backgroundColor: 'white',
      transition: 'all 0.2s',
      overflow: 'hidden',
      _focusWithin: {
        borderColor: '#7088A8'
      },
      '&[aria-disabled=true]': {
        backgroundColor: 'gray.200',
        borderColor: 'gray.200',
        cursor: 'not-allowed'
      }
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      '&[aria-disabled=true]': {
        cursor: 'not-allowed',
        opacity: 0.5
      }
    },
    triggerIcon: {
      color: 'gray.500',
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    },
    divider: {
      width: '1px',
      height: '24px',
      backgroundColor: 'gray.200',
      flexShrink: 0
    },
    dialCode: {
      fontWeight: 'medium',
      color: 'navyGray.700',
      fontSize: '16px',
      flexShrink: 0,
      _disabled: {
        color: 'gray.500'
      }
    },
    nativeInput: {
      flex: '1',
      minWidth: '0',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      paddingLeft: '8px',
      paddingRight: '0',
      fontSize: '14px',
      lineHeight: '1.43',
      color: 'navyGray.700',
      _placeholder: {
        color: 'gray.500'
      },
      _disabled: {
        color: 'gray.500',
        cursor: 'not-allowed'
      },
      _focusVisible: {
        outline: 'none',
        boxShadow: 'none'
      }
    }
  },
  variants: {
    invalid: {
      true: {
        wrapper: {
          borderColor: 'red.200',
          backgroundColor: '#FAF0F1'
        }
      }
    }
  }
});
