import { defineSlotRecipe } from '@chakra-ui/react';

export const phoneInputDropdownRecipe = defineSlotRecipe({
  slots: [
    'content',
    'itemList',
    'item',
    'itemIcon',
    'itemText',
    'itemDialCode',
    'itemCheckIcon',
    'emptyState'
  ],
  className: 'phone-input-dropdown',
  base: {
    content: {
      backgroundColor: 'base.white',
      borderRadius: '8px',
      boxShadow:
        '0px 0px 1px 0px rgba(24, 24, 27, 0.3), 0px 4px 8px 0px rgba(24, 24, 27, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '336px',
      overflowY: 'hidden',
      overflowX: 'hidden',
      marginTop: '8px',
      padding: '12px'
    },
    itemList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0px',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: '100%',
      scrollBehavior: 'smooth',
      scrollbarWidth: 'thin',
      scrollbarColor: '#D1D5DB transparent',
      marginTop: '8px',
      '&::-webkit-scrollbar': {
        width: '6px'
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#D1D5DB',
        borderRadius: '3px'
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#9CA3AF'
      }
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      paddingX: '12px',
      paddingY: '10px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.15s',
      _hover: {
        backgroundColor: 'gray.50'
      },
      marginRight: '4px'
    },
    itemIcon: {
      width: '30px',
      height: '26px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    itemText: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: '16px',
      lineHeight: '24px',
      color: 'navyGray.700',
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    itemDialCode: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: '16px',
      lineHeight: '24px',
      color: 'gray.500',
      flexShrink: 0
    },
    itemCheckIcon: {
      width: '20px',
      height: '20px',
      flexShrink: 0,
      color: 'green.200'
    },
    emptyState: {
      fontFamily: 'body',
      fontWeight: 'regular',
      fontSize: '14px',
      lineHeight: '20px',
      color: 'gray.400',
      padding: '8px 4px',
      textAlign: 'center'
    }
  }
});
