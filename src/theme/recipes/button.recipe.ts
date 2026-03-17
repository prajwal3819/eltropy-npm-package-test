import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  className: 'button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    _disabled: {
      cursor: 'not-allowed',
      opacity: 1,
    },
    _focusVisible: {
      outline: '2px solid var(--outline-focused, #7088a8)',
      outlineOffset: '2px',
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'green.200',
        color: 'white',
        _hover: {
          bg: 'green.300',
          _disabled: {
            bg: 'gray.200',
          },
        },
        _disabled: {
          bg: 'gray.200',
          color: 'gray.400',
        },
        '&[data-loading][data-loading]': {
          bg: 'green.200',
          color: 'white',
          opacity: 1,
          cursor: 'not-allowed',
          _hover: { bg: 'green.200' },
        },
      },
      outlined: {
        bg: 'transparent',
        color: 'navyGray.700',
        borderWidth: '1px',
        borderColor: 'navyGray.700',
        _hover: {
          bg: 'gray.50',
          _disabled: {
            bg: 'transparent',
          },
        },
        _disabled: {
          borderColor: 'gray.200',
          color: 'gray.400',
          bg: 'gray.200',
        },
        _loading: {
          bg: 'transparent',
          color: 'navyGray.700',
          borderColor: 'navyGray.700',
          opacity: 1,
          cursor: 'not-allowed',
        },
      },
      outlinedFilled: {
        bg: 'gray.50',
        color: 'navyGray.700',
        borderWidth: '1px',
        borderColor: 'navyGray.700',
        _hover: {
          bg: 'gray.100',
          _disabled: {
            bg: 'gray.100',
          },
        },
        _disabled: {
          bg: 'gray.200',
          borderColor: 'gray.200',
          color: 'gray.400',
        },
        _loading: {
          bg: 'gray.50',
          color: 'navyGray.700',
          borderColor: 'navyGray.700',
          opacity: 1,
          cursor: 'not-allowed',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'navyGray.700',
        _hover: {
          bg: 'gray.50',
        },
        _disabled: {
          color: 'gray.400',
          bg: 'transparent',
        },
      },
      textLink: {
        bg: 'transparent',
        color: 'navyGray.700',
        textDecoration: 'underline',
        fontWeight: 'medium',
        _hover: {
          color: 'navyGray.700',
          _disabled: {
            color: 'gray.400',
          },
        },
        _disabled: {
          color: 'gray.400',
          textDecoration: 'none',
        },
      },
      danger: {
        bg: 'red.200',
        color: 'white',
        _hover: {
          bg: 'red.300',
          _disabled: {
            bg: 'gray.200',
          },
        },
        _disabled: {
          bg: 'gray.200',
          color: 'gray.400',
        },
      },
    },
    size: {
      xs: {
        h: '24px',
        px: '12px',
        py: '4px',
        fontSize: '12px',
        fontWeight: 'medium',
        borderRadius: '8px',
        gap: '4px',
      },
      sm: {
        h: '32px',
        px: '16px',
        py: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRadius: '8px',
        gap: '4px',
      },
      md: {
        h: '40px',
        px: '20px',
        py: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '12px',
        gap: '4px',
      },
      lg: {
        h: '48px',
        px: '24px',
        py: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius: '12px',
        gap: '8px',
      },
      xl: {
        h: '56px',
        px: '32px',
        py: '16px',
        fontSize: '18px',
        fontWeight: 'bold',
        borderRadius: '16px',
        gap: '8px',
      },
    },
    iconOnly: {
      true: {
        px: '0',
        aspectRatio: '1',
        borderRadius: 'full',
      },
    },
    splitButton: {
      true: {},
    },
  },
  compoundVariants: [
    {
      size: 'xs',
      splitButton: true,
      css: {
        px: '8px',
      },
    },
    {
      size: 'sm',
      splitButton: true,
      css: {
        px: '8px',
      },
    },
    {
      size: 'md',
      splitButton: true,
      css: {
        px: '12px',
      },
    },
    {
      size: 'lg',
      splitButton: true,
      css: {
        px: '12px',
      },
    },
    {
      size: 'xl',
      splitButton: true,
      css: {
        px: '16px',
      },
    },
    {
      size: 'xs',
      iconOnly: true,
      css: {
        w: '24px',
        h: '24px',
        padding: '6px',
      },
    },
    {
      size: 'sm',
      iconOnly: true,
      css: {
        w: '32px',
        h: '32px',
        padding: '8px',
      },
    },
    {
      size: 'md',
      iconOnly: true,
      css: {
        w: '40px',
        h: '40px',
        padding: '10px',
      },
    },
    {
      size: 'lg',
      iconOnly: true,
      css: {
        w: '48px',
        h: '48px',
        padding: '12px',
      },
    },
    {
      size: 'xl',
      iconOnly: true,
      css: {
        w: '56px',
        h: '56px',
        padding: '16px',
      },
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
