import { defineSlotRecipe } from '@chakra-ui/react';

export const checkboxRecipe = defineSlotRecipe({
  slots: ['root', 'control', 'label', 'indicator'],
  className: 'checkbox',
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      _disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&[data-state=checked] .checkbox__control': {
        backgroundColor: 'successGreen.200',
        borderColor: 'successGreen.200',
      },

      '&[data-state=indeterminate] .checkbox__control': {
        backgroundColor: 'successGreen.200',
        borderColor: 'successGreen.200',
      },

      '&[data-focus-visible] .checkbox__control': {
        outline: '2px solid',
        outlineColor: 'navyGray.300',
      },

      '&[data-disabled] .checkbox__control': {
        borderColor: 'gray.200',
        backgroundColor: 'gray.100',
      },
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'gray.300',
      borderRadius: '4px',
      backgroundColor: 'transparent',
      transition: 'all 0.15s',
      cursor: 'pointer',
      _hover: {
        borderColor: 'successGreen.200',
      },
      _checked: {
        backgroundColor: 'successGreen.200',
        borderColor: 'successGreen.200',
      },
      _indeterminate: {
        backgroundColor: 'successGreen.200',
        borderColor: 'successGreen.200',
      },
      _disabled: {
        borderColor: 'gray.200',
        backgroundColor: 'gray.100',
      },
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'base.white',
    },
    label: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: '14px',
      lineHeight: '20px',
      color: 'navyGray.700',
    },
  },
  variants: {
    size: {
      sm: {
        control: {
          width: '16px',
          height: '16px',
        },
        indicator: {
          fontSize: '10px',
        },
        label: {
          fontSize: '12px',
          lineHeight: '18px',
        },
      },
      md: {
        control: {
          width: '20px',
          height: '20px',
        },
        indicator: {
          fontSize: '12px',
        },
        label: {
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
      lg: {
        control: {
          width: '24px',
          height: '24px',
        },
        indicator: {
          fontSize: '14px',
        },
        label: {
          fontSize: '14px',
          lineHeight: '20px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
