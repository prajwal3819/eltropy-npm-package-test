import { defineSlotRecipe } from '@chakra-ui/react';

export const tooltipRecipe = defineSlotRecipe({
  className: 'tooltip',
  slots: ['trigger', 'content', 'arrow', 'arrowTip', 'positioner'],
  base: {
    content: {
      '--tooltip-bg': 'colors.gray.800',
      bg: 'var(--tooltip-bg)',
      color: 'gray.50',
      px: '1',
      py: '1',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '400',
      fontFamily:
        '"ABC Diatype", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
      lineHeight: '1.5em',
      boxShadow:
        '0px 0.175px 6.07px 0px rgba(34, 38, 65, 0.04), 0px 0.8px 17.06px 0px rgba(34, 38, 65, 0.06), 0px 2.025px 45.77px 0px rgba(34, 38, 65, 0.08)',
      maxW: 'xs',
      zIndex: 'tooltip'
    },
    arrow: {
      '--arrow-size': '11.31px',
      '--arrow-bg': 'colors.gray.800'
    },
    arrowTip: {
      bg: 'gray.800'
    },
    positioner: {
      zIndex: 'tooltip'
    }
  }
});
