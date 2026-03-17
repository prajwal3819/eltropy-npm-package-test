import { defineSlotRecipe } from '@chakra-ui/react';

export const tagRecipe = defineSlotRecipe({
  slots: ['root', 'label', 'startElement', 'endElement', 'closeTrigger'],
  className: 'tag',
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '100px',
      fontFamily: 'body',
      fontWeight: 'regular',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
      _disabled: {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
    label: {
      display: 'inline-flex',
      alignItems: 'center',
    },
    startElement: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    endElement: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    closeTrigger: {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
      _hover: {
        opacity: 0.7,
      },
    },
  },
  variants: {
    variant: {
      solid: {},
      subtle: {},
    },
    size: {
      sm: {
        root: {
          height: '16px',
          px: '8px',
          py: '4px',
          gap: '4px',
        },
        label: {
          fontSize: '12px',
          lineHeight: '18px',
        },
        startElement: {
          fontSize: '12px',
          width: '12px',
          height: '12px',
        },
        endElement: {
          fontSize: '12px',
          width: '12px',
          height: '12px',
        },
        closeTrigger: {
          fontSize: '12px',
          width: '12px',
          height: '12px',
        },
      },
      md: {
        root: {
          height: '24px',
          px: '8px',
          py: '4px',
          gap: '4px',
        },
        label: {
          fontSize: '12px',
          lineHeight: '18px',
        },
        startElement: {
          fontSize: '12px',
          width: '12px',
          height: '12px',
        },
        endElement: {
          fontSize: '12px',
          width: '12px',
          height: '12px',
        },
        closeTrigger: {
          fontSize: '12px',
          width: '12px',
          height: '12px',
        },
      },
      lg: {
        root: {
          height: '32px',
          px: '12px',
          py: '8px',
          gap: '8px',
        },
        label: {
          fontSize: '14px',
          lineHeight: '20px',
        },
        startElement: {
          fontSize: '16px',
          width: '16px',
          height: '16px',
        },
        endElement: {
          fontSize: '16px',
          width: '16px',
          height: '16px',
        },
        closeTrigger: {
          fontSize: '16px',
          width: '16px',
          height: '16px',
        },
      },
    },
    colorScheme: {
      red: {},
      blue: {},
      yellow: {},
      green: {},
      orange: {},
      violet: {},
      gray: {},
      outlined: {},
    },
  },
  compoundVariants: [
    // Red - Solid
    {
      variant: 'solid',
      colorScheme: 'red',
      css: {
        root: {
          bg: 'red.200',
          color: 'white',
          _hover: {
            border: '2px solid',
            borderColor: 'red.400',
            _disabled: {
              bg: 'red.200',
            },
          },
          _disabled: {
            bg: 'red.100',
            color: 'white',
          },
        },
      },
    },
    // Red - Subtle
    {
      variant: 'subtle',
      colorScheme: 'red',
      css: {
        root: {
          bg: 'red.50',
          color: 'red.400',
          _hover: {
            border: '1px solid',
            borderColor: 'red.400',
            _disabled: {
              bg: 'red.50',
            },
          },
          _disabled: {
            bg: 'red.50',
            color: 'red.200',
          },
        },
      },
    },
    // Blue - Solid
    {
      variant: 'solid',
      colorScheme: 'blue',
      css: {
        root: {
          bg: 'blue.200',
          color: 'white',
          _hover: {
            border: '1px solid',
            borderColor: 'navyGray.950',
            _disabled: {
              bg: 'blue.200',
            },
          },
          _disabled: {
            bg: 'blue.100',
            color: 'white',
          },
        },
      },
    },
    // Blue - Subtle
    {
      variant: 'subtle',
      colorScheme: 'blue',
      css: {
        root: {
          bg: 'blue.50',
          color: 'blue.400',
          _hover: {
            border: '1px solid',
            borderColor: 'blue.400',
            _disabled: {
              bg: 'blue.50',
            },
          },
          _disabled: {
            bg: 'blue.50',
            color: 'blue.200',
          },
        },
      },
    },
    // Yellow - Solid
    {
      variant: 'solid',
      colorScheme: 'yellow',
      css: {
        root: {
          bg: 'yellow.200',
          color: 'yellow.900',
          _hover: {
            border: '1px solid',
            borderColor: 'yellow.900',
            _disabled: {
              bg: 'yellow.200',
            },
          },
          _disabled: {
            bg: 'yellow.100',
            color: 'yellow.600',
          },
        },
      },
    },
    // Yellow - Subtle
    {
      variant: 'subtle',
      colorScheme: 'yellow',
      css: {
        root: {
          bg: 'yellow.50',
          color: 'yellow.900',
          _hover: {
            border: '1px solid',
            borderColor: 'yellow.900',
            _disabled: {
              bg: 'yellow.50',
            },
          },
          _disabled: {
            bg: 'yellow.50',
            color: 'yellow.400',
          },
        },
      },
    },
    // Green - Solid
    {
      variant: 'solid',
      colorScheme: 'green',
      css: {
        root: {
          bg: 'successGreen.300',
          color: 'white',
          _hover: {
            border: '1px solid',
            borderColor: 'successGreen.400',
            _disabled: {
              bg: 'successGreen.300',
            },
          },
          _disabled: {
            bg: 'successGreen.200',
            color: 'white',
          },
        },
      },
    },
    // Green - Subtle
    {
      variant: 'subtle',
      colorScheme: 'green',
      css: {
        root: {
          bg: 'green.50',
          color: 'successGreen.400',
          _hover: {
            border: '1px solid',
            borderColor: 'successGreen.400',
            _disabled: {
              bg: 'successGreen.50',
            },
          },
          _disabled: {
            bg: 'successGreen.50',
            color: 'successGreen.300',
          },
        },
      },
    },
    // Orange - Solid
    {
      variant: 'solid',
      colorScheme: 'orange',
      css: {
        root: {
          bg: 'orange.200',
          color: 'white',
          _hover: {
            border: '1px solid',
            borderColor: 'orange.900',
            _disabled: {
              bg: 'orange.200',
            },
          },
          _disabled: {
            bg: 'orange.100',
            color: 'white',
          },
        },
      },
    },
    // Orange - Subtle
    {
      variant: 'subtle',
      colorScheme: 'orange',
      css: {
        root: {
          bg: 'orange.50',
          color: 'orange.900',
          _hover: {
            border: '1px solid',
            borderColor: 'orange.900',
            _disabled: {
              bg: 'orange.50',
            },
          },
          _disabled: {
            bg: 'orange.50',
            color: 'orange.300',
          },
        },
      },
    },
    // Violet - Solid
    {
      variant: 'solid',
      colorScheme: 'violet',
      css: {
        root: {
          bg: 'violet.400',
          color: 'white',
          _hover: {
            border: '1px solid',
            borderColor: 'violet.500',
            _disabled: {
              bg: 'violet.400',
            },
          },
          _disabled: {
            bg: 'violet.100',
            color: 'white',
          },
        },
      },
    },
    // Violet - Subtle
    {
      variant: 'subtle',
      colorScheme: 'violet',
      css: {
        root: {
          bg: 'violet.50',
          color: 'violet.500',
          _hover: {
            border: '1px solid',
            borderColor: 'violet.500',
            _disabled: {
              bg: 'violet.50',
            },
          },
          _disabled: {
            bg: 'violet.50',
            color: 'violet.300',
          },
        },
      },
    },
    // Gray - Solid
    {
      variant: 'solid',
      colorScheme: 'gray',
      css: {
        root: {
          bg: 'gray.600',
          color: 'white',
          _hover: {
            border: '1px solid',
            borderColor: 'gray.950',
            _disabled: {
              bg: 'gray.600',
            },
          },
          _disabled: {
            bg: 'gray.400',
            color: 'white',
          },
        },
      },
    },
    // Gray - Subtle
    {
      variant: 'subtle',
      colorScheme: 'gray',
      css: {
        root: {
          bg: 'gray.50',
          color: 'gray.600',
          _hover: {
            border: '1px solid',
            borderColor: 'gray.600',
            _disabled: {
              bg: 'gray.50',
            },
          },
          _disabled: {
            bg: 'gray.100',
            color: 'gray.400',
          },
        },
      },
    },
    // Outlined - Solid
    {
      variant: 'solid',
      colorScheme: 'outlined',
      css: {
        root: {
          bg: 'transparent',
          color: 'gray.700',
          borderWidth: '1px',
          borderColor: 'gray.300',
          _hover: {
            borderColor: 'gray.400',
            bg: 'gray.50',
            _disabled: {
              bg: 'transparent',
              borderColor: 'gray.300',
            },
          },
          _disabled: {
            color: 'gray.400',
            borderColor: 'gray.200',
          },
        },
      },
    },
    // Outlined - Subtle (same as solid for outlined)
    {
      variant: 'subtle',
      colorScheme: 'outlined',
      css: {
        root: {
          bg: 'transparent',
          color: 'gray.700',
          borderWidth: '1px',
          borderColor: 'gray.100',
          _hover: {
            borderColor: 'gray.200',
            bg: 'gray.100',
            _disabled: {
              bg: 'transparent',
              borderColor: 'gray.100',
            },
          },
          _disabled: {
            color: 'gray.400',
            borderColor: 'gray.200',
          },
        },
      },
    },
  ],
  defaultVariants: {
    variant: 'solid',
    size: 'md',
    colorScheme: 'gray',
  },
});
