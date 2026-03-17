import { defineSlotRecipe } from '@chakra-ui/react';

export const tableRecipe = defineSlotRecipe({
  className: 'table',
  slots: [
    'root',
    'scrollContainer',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'headerContent',
    'sortIcon',
    'checkboxCell',
    'actionIconButton',
    'paginationContainer'
  ],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      bg: 'base.white',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'gray.200',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    scrollContainer: {
      overflowX: 'auto',
      overflowY: 'hidden',
      width: '100%'
    },
    table: {
      width: '100%',
      minWidth: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      tableLayout: 'auto'
    },
    thead: {
      bg: 'gray.50'
    },
    tbody: {},
    tr: {
      transition: 'background-color 0.15s ease-in-out'
    },
    th: {
      height: '56px',
      padding: '12px',
      bg: 'gray.50',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'gray.200',
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: 'normal',
      color: 'gray.600',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle'
    },
    td: {
      height: '64px',
      paddingX: '12px',
      paddingY: '0',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'gray.200',
      fontSize: '14px',
      fontWeight: 'regular',
      lineHeight: '20px',
      color: 'navyGray.700',
      textAlign: 'left',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '100%'
    },
    sortIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      flexShrink: 0,
      color: 'navyGray.700',
      cursor: 'pointer'
    },
    checkboxCell: {
      width: '57px',
      paddingX: '12px',
      paddingTop: '8px',
      paddingBottom: '12px'
    },
    actionIconButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '24px',
      height: '24px',
      padding: '0',
      border: 'none',
      bg: 'transparent',
      color: 'navyGray.700',
      cursor: 'pointer',
      borderRadius: '100px',
      flexShrink: 0
    },
    paginationContainer: {
      paddingX: '12px',
      paddingY: '12px',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: 'gray.200'
    }
  },
  variants: {
    rowState: {
      default: {
        tr: {
          bg: 'base.white'
        }
      },
      hover: {
        tr: {
          bg: 'gray.50'
        }
      },
      selected: {
        tr: {
          bg: 'gray.50'
        }
      }
    },
    stickyColumn: {
      true: {
        th: {
          position: 'sticky',
          left: 0,
          zIndex: 2,
          bg: 'gray.50'
        },
        td: {
          position: 'sticky',
          left: 0,
          zIndex: 1,
          bg: 'base.white'
        }
      }
    }
  },
  defaultVariants: {
    rowState: 'default'
  }
});
