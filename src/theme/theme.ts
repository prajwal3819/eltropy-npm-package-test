import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { colors } from './tokens/colors';
import {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  textStyles as typographyTextStyles
} from './tokens/typography';
import { spacing, sizes, radii } from './tokens/spacing';
import { recipes, slotRecipes } from './recipes';

const config = defineConfig({
  theme: {
    recipes: {
      button: recipes.button
    },
    slotRecipes: {
      tag: recipes.tag,
      dropdown: recipes.dropdown,
      checkbox: recipes.checkbox,
      tabs: recipes.tabs,
      textInput: recipes.textInput,
      phoneInputDropdown: recipes.phoneInputDropdown,
      searchInput: recipes.searchInput,
      tooltip: recipes.tooltip,
      fileUpload: slotRecipes.fileUpload,
      pagination: slotRecipes.pagination,
      table: slotRecipes.table
    },
    breakpoints: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    tokens: {
      colors: {
        base: {
          white: { value: colors.base.white },
          black: { value: colors.base.black }
        },
        green: {
          50: { value: colors.green[50] },
          100: { value: colors.green[100] },
          200: { value: colors.green[200] },
          300: { value: colors.green[300] },
          400: { value: colors.green[400] }
        },
        blue: {
          50: { value: colors.blue[50] },
          100: { value: colors.blue[100] },
          200: { value: colors.blue[200] },
          300: { value: colors.blue[300] },
          400: { value: colors.blue[400] }
        },
        gray: {
          50: { value: colors.gray[50] },
          100: { value: colors.gray[100] },
          200: { value: colors.gray[200] },
          300: { value: colors.gray[300] },
          400: { value: colors.gray[400] },
          500: { value: colors.gray[500] },
          600: { value: colors.gray[600] },
          700: { value: colors.gray[700] },
          800: { value: colors.gray[800] },
          900: { value: colors.gray[900] },
          950: { value: colors.gray[950] }
        },
        navyGray: {
          50: { value: colors.navyGray[50] },
          100: { value: colors.navyGray[100] },
          200: { value: colors.navyGray[200] },
          300: { value: colors.navyGray[300] },
          400: { value: colors.navyGray[400] },
          500: { value: colors.navyGray[500] },
          600: { value: colors.navyGray[600] },
          700: { value: colors.navyGray[700] },
          800: { value: colors.navyGray[800] },
          900: { value: colors.navyGray[900] },
          950: { value: colors.navyGray[950] }
        },
        violet: {
          50: { value: colors.violet[50] },
          100: { value: colors.violet[100] },
          200: { value: colors.violet[200] },
          300: { value: colors.violet[300] },
          400: { value: colors.violet[400] },
          500: { value: colors.violet[500] }
        },
        yellow: {
          50: { value: colors.yellow[50] },
          100: { value: colors.yellow[100] },
          200: { value: colors.yellow[200] },
          300: { value: colors.yellow[300] },
          900: { value: colors.yellow[900] }
        },
        successGreen: {
          50: { value: colors.successGreen[50] },
          100: { value: colors.successGreen[100] },
          200: { value: colors.successGreen[200] },
          300: { value: colors.successGreen[300] },
          400: { value: colors.successGreen[400] }
        },
        red: {
          50: { value: colors.red[50] },
          100: { value: colors.red[100] },
          200: { value: colors.red[200] },
          300: { value: colors.red[300] },
          400: { value: colors.red[400] }
        },
        orange: {
          50: { value: colors.orange[50] },
          100: { value: colors.orange[100] },
          200: { value: colors.orange[200] },
          300: { value: colors.orange[300] },
          900: { value: colors.orange[900] }
        },
        brand: {
          primary: { value: colors.green[200] },
          secondary: { value: colors.blue[200] }
        }
      },
      fonts: {
        heading: { value: fonts.heading },
        body: { value: fonts.body },
        mono: { value: fonts.mono }
      },
      fontSizes: {
        12: { value: fontSizes[12] },
        14: { value: fontSizes[14] },
        16: { value: fontSizes[16] },
        18: { value: fontSizes[18] },
        20: { value: fontSizes[20] },
        24: { value: fontSizes[24] },
        28: { value: fontSizes[28] },
        32: { value: fontSizes[32] },
        40: { value: fontSizes[40] },
        48: { value: fontSizes[48] },
        56: { value: fontSizes[56] },
        64: { value: fontSizes[64] },
        72: { value: fontSizes[72] },
        80: { value: fontSizes[80] },
        88: { value: fontSizes[88] },
        96: { value: fontSizes[96] },
        104: { value: fontSizes[104] },
        112: { value: fontSizes[112] },
        120: { value: fontSizes[120] }
      },
      fontWeights: {
        regular: { value: fontWeights.regular },
        medium: { value: fontWeights.medium },
        bold: { value: fontWeights.bold }
      },
      lineHeights: {
        16: { value: lineHeights[16] },
        18: { value: lineHeights[18] },
        20: { value: lineHeights[20] },
        24: { value: lineHeights[24] },
        28: { value: lineHeights[28] },
        30: { value: lineHeights[30] },
        36: { value: lineHeights[36] },
        42: { value: lineHeights[42] },
        48: { value: lineHeights[48] },
        60: { value: lineHeights[60] },
        68: { value: lineHeights[68] },
        72: { value: lineHeights[72] },
        76: { value: lineHeights[76] },
        84: { value: lineHeights[84] },
        92: { value: lineHeights[92] },
        108: { value: lineHeights[108] },
        116: { value: lineHeights[116] },
        124: { value: lineHeights[124] },
        132: { value: lineHeights[132] }
      },
      spacing: {
        0: { value: spacing[0] },
        1: { value: spacing[1] },
        2: { value: spacing[2] },
        3: { value: spacing[3] },
        4: { value: spacing[4] },
        5: { value: spacing[5] },
        6: { value: spacing[6] },
        8: { value: spacing[8] },
        10: { value: spacing[10] },
        12: { value: spacing[12] },
        14: { value: spacing[14] },
        16: { value: spacing[16] },
        18: { value: spacing[18] },
        20: { value: spacing[20] }
      },
      sizes: {
        0: { value: sizes[0] },
        1: { value: sizes[1] },
        2: { value: sizes[2] },
        3: { value: sizes[3] },
        4: { value: sizes[4] },
        5: { value: sizes[5] },
        6: { value: sizes[6] },
        8: { value: sizes[8] },
        10: { value: sizes[10] },
        12: { value: sizes[12] },
        14: { value: sizes[14] },
        16: { value: sizes[16] },
        18: { value: sizes[18] },
        20: { value: sizes[20] },
        container: {
          sm: { value: sizes.container.sm },
          md: { value: sizes.container.md },
          lg: { value: sizes.container.lg },
          xl: { value: sizes.container.xl }
        }
      },
      radii: {
        none: { value: radii.none },
        sm: { value: radii.sm },
        base: { value: radii.base },
        md: { value: radii.md },
        lg: { value: radii.lg },
        xl: { value: radii.xl },
        '2xl': { value: radii['2xl'] },
        '3xl': { value: radii['3xl'] },
        '4xl': { value: radii['4xl'] },
        '5xl': { value: radii['5xl'] }
      }
    },

    textStyles: typographyTextStyles,

    // Layer styles for consistent container styling
    layerStyles: {
      card: {
        value: {
          bg: '{colors.bg}',
          borderWidth: '1px',
          borderColor: '{colors.border}',
          borderRadius: '{radii.lg}',
          boxShadow: 'sm'
        }
      },
      'card.elevated': {
        value: {
          bg: '{colors.bg}',
          borderRadius: '{radii.lg}',
          boxShadow: 'md'
        }
      },
      'card.outline': {
        value: {
          bg: 'transparent',
          borderWidth: '1px',
          borderColor: '{colors.border}',
          borderRadius: '{radii.lg}'
        }
      },
      'card.filled': {
        value: {
          bg: '{colors.bg.subtle}',
          borderRadius: '{radii.lg}'
        }
      }
    }
  }
});

const system = createSystem(defaultConfig, config);

export default system;
