export const fonts = {
  heading:
    '"ABC Diatype Medium", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  body: '"ABC Diatype", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
};

const pxToRem = (px: number) => `${px / 16}rem`;

export const fontSizes = {
  12: '12px',
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
  28: '28px',
  32: '32px',
  40: '40px',
  48: '48px',
  56: '56px',
  64: '64px',
  72: '72px',
  80: '80px',
  88: '88px',
  96: '96px',
  104: '104px',
  112: '112px',
  120: '120px'
};

export const fontWeights = {
  regular: '400',
  medium: '500',
  bold: '700'
};

export const lineHeights = {
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
  28: '28px',
  30: '30px',
  36: '36px',
  42: '42px',
  48: '48px',
  60: '60px',
  68: '68px',
  72: '72px',
  76: '76px',
  84: '84px',
  92: '92px',
  108: '108px',
  116: '116px',
  124: '124px',
  132: '132px'
};

// Text styles matching Figma typography table
export const textStyles = {
  // Heading styles (ABC Diatype Heading - Regular & Bold)
  'heading/bold/120': {
    fontSize: fontSizes[120],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[132],
    fontFamily: fonts.heading
  },
  'heading/regular/120': {
    fontSize: fontSizes[120],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[132],
    fontFamily: fonts.heading
  },
  'heading/bold/112': {
    fontSize: fontSizes[112],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[124],
    fontFamily: fonts.heading
  },
  'heading/regular/112': {
    fontSize: fontSizes[112],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[124],
    fontFamily: fonts.heading
  },
  'heading/bold/104': {
    fontSize: fontSizes[104],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[116],
    fontFamily: fonts.heading
  },
  'heading/regular/104': {
    fontSize: fontSizes[104],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[116],
    fontFamily: fonts.heading
  },
  'heading/bold/96': {
    fontSize: fontSizes[96],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[108],
    fontFamily: fonts.heading
  },
  'heading/regular/96': {
    fontSize: fontSizes[96],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[108],
    fontFamily: fonts.heading
  },
  'heading/bold/80': {
    fontSize: fontSizes[80],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[92],
    fontFamily: fonts.heading
  },
  'heading/regular/80': {
    fontSize: fontSizes[80],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[92],
    fontFamily: fonts.heading
  },
  'heading/bold/72': {
    fontSize: fontSizes[72],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[84],
    fontFamily: fonts.heading
  },
  'heading/regular/72': {
    fontSize: fontSizes[72],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[84],
    fontFamily: fonts.heading
  },
  'heading/bold/64': {
    fontSize: fontSizes[64],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[76],
    fontFamily: fonts.heading
  },
  'heading/regular/64': {
    fontSize: fontSizes[64],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[76],
    fontFamily: fonts.heading
  },
  'heading/bold/56': {
    fontSize: fontSizes[56],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[72],
    fontFamily: fonts.heading
  },
  'heading/regular/56': {
    fontSize: fontSizes[56],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[72],
    fontFamily: fonts.heading
  },
  'heading/bold/48': {
    fontSize: fontSizes[48],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[72],
    fontFamily: fonts.heading
  },
  'heading/regular/48': {
    fontSize: fontSizes[48],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[72],
    fontFamily: fonts.heading
  },
  'heading/bold/40': {
    fontSize: fontSizes[40],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[60],
    fontFamily: fonts.heading
  },
  'heading/regular/40': {
    fontSize: fontSizes[40],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[60],
    fontFamily: fonts.heading
  },
  'heading/bold/32': {
    fontSize: fontSizes[32],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[48],
    fontFamily: fonts.heading
  },
  'heading/regular/32': {
    fontSize: fontSizes[32],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[48],
    fontFamily: fonts.heading
  },
  'heading/bold/24': {
    fontSize: fontSizes[24],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[36],
    fontFamily: fonts.heading
  },
  'heading/regular/24': {
    fontSize: fontSizes[24],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[36],
    fontFamily: fonts.heading
  },
  'heading/bold/20': {
    fontSize: fontSizes[20],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[28],
    fontFamily: fonts.heading
  },
  'heading/regular/20': {
    fontSize: fontSizes[20],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[28],
    fontFamily: fonts.heading
  },
  'heading/bold/18': {
    fontSize: fontSizes[18],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[28],
    fontFamily: fonts.heading
  },
  'heading/regular/18': {
    fontSize: fontSizes[18],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[28],
    fontFamily: fonts.heading
  },
  'heading/bold/16': {
    fontSize: fontSizes[16],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[24],
    fontFamily: fonts.heading
  },
  'heading/regular/16': {
    fontSize: fontSizes[16],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[24],
    fontFamily: fonts.heading
  },
  'heading/bold/14': {
    fontSize: fontSizes[14],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[20],
    fontFamily: fonts.heading
  },
  'heading/regular/14': {
    fontSize: fontSizes[14],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[20],
    fontFamily: fonts.heading
  },
  'heading/bold/12': {
    fontSize: fontSizes[12],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[18],
    fontFamily: fonts.heading
  },
  'heading/regular/12': {
    fontSize: fontSizes[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[18],
    fontFamily: fonts.heading
  },

  // Body styles (ABC Diatype Body - Regular, Medium & Bold)
  'body/regular/24': {
    fontSize: fontSizes[24],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[36],
    fontFamily: fonts.body
  },
  'body/medium/24': {
    fontSize: fontSizes[24],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[36],
    fontFamily: fonts.body
  },
  'body/bold/24': {
    fontSize: fontSizes[24],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[36],
    fontFamily: fonts.body
  },
  'body/regular/20': {
    fontSize: fontSizes[20],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[28],
    fontFamily: fonts.body
  },
  'body/medium/20': {
    fontSize: fontSizes[20],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[28],
    fontFamily: fonts.body
  },
  'body/bold/20': {
    fontSize: fontSizes[20],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[28],
    fontFamily: fonts.body
  },
  'body/regular/18': {
    fontSize: fontSizes[18],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[28],
    fontFamily: fonts.body
  },
  'body/medium/18': {
    fontSize: fontSizes[18],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[28],
    fontFamily: fonts.body
  },
  'body/bold/18': {
    fontSize: fontSizes[18],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[28],
    fontFamily: fonts.body
  },
  'body/regular/16': {
    fontSize: fontSizes[16],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[24],
    fontFamily: fonts.body
  },
  'body/medium/16': {
    fontSize: fontSizes[16],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[24],
    fontFamily: fonts.body
  },
  'body/bold/16': {
    fontSize: fontSizes[16],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[24],
    fontFamily: fonts.body
  },
  'body/regular/14': {
    fontSize: fontSizes[14],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[20],
    fontFamily: fonts.body
  },
  'body/medium/14': {
    fontSize: fontSizes[14],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[20],
    fontFamily: fonts.body
  },
  'body/bold/14': {
    fontSize: fontSizes[14],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[20],
    fontFamily: fonts.body
  },
  'body/regular/12': {
    fontSize: fontSizes[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights[18],
    fontFamily: fonts.body
  },
  'body/medium/12': {
    fontSize: fontSizes[12],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights[18],
    fontFamily: fonts.body
  },
  'body/bold/12': {
    fontSize: fontSizes[12],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights[18],
    fontFamily: fonts.body
  }
};

export const fontSizesInRem = {
  12: pxToRem(12),
  14: pxToRem(14),
  16: pxToRem(16),
  18: pxToRem(18),
  20: pxToRem(20),
  24: pxToRem(24),
  28: pxToRem(28),
  32: pxToRem(32),
  40: pxToRem(40),
  48: pxToRem(48),
  56: pxToRem(56),
  64: pxToRem(64),
  72: pxToRem(72),
  80: pxToRem(80),
  88: pxToRem(88),
  96: pxToRem(96),
  104: pxToRem(104),
  112: pxToRem(112),
  120: pxToRem(120)
};

export const lineHeightsInRem = {
  16: pxToRem(16),
  18: pxToRem(18),
  20: pxToRem(20),
  24: pxToRem(24),
  28: pxToRem(28),
  30: pxToRem(30),
  36: pxToRem(36),
  42: pxToRem(42),
  48: pxToRem(48),
  60: pxToRem(60),
  68: pxToRem(68),
  72: pxToRem(72),
  76: pxToRem(76),
  84: pxToRem(84),
  92: pxToRem(92),
  108: pxToRem(108),
  116: pxToRem(116),
  124: pxToRem(124),
  132: pxToRem(132)
};

// Note: I've truncated the full list for brevity, but here is the structure
// including your new Label and Caption variants.
export const textStylesInRem = {
  'heading/bold/120': {
    fontSize: fontSizesInRem[120],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[132],
    fontFamily: fonts.heading
  },
  'heading/regular/120': {
    fontSize: fontSizesInRem[120],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[132],
    fontFamily: fonts.heading
  },
  'heading/bold/112': {
    fontSize: fontSizesInRem[112],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[124],
    fontFamily: fonts.heading
  },
  'heading/regular/112': {
    fontSize: fontSizesInRem[112],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[124],
    fontFamily: fonts.heading
  },
  'heading/bold/104': {
    fontSize: fontSizesInRem[104],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[116],
    fontFamily: fonts.heading
  },
  'heading/regular/104': {
    fontSize: fontSizesInRem[104],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[116],
    fontFamily: fonts.heading
  },
  'heading/bold/96': {
    fontSize: fontSizesInRem[96],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[108],
    fontFamily: fonts.heading
  },
  'heading/regular/96': {
    fontSize: fontSizesInRem[96],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[108],
    fontFamily: fonts.heading
  },
  'heading/bold/80': {
    fontSize: fontSizesInRem[80],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[92],
    fontFamily: fonts.heading
  },
  'heading/regular/80': {
    fontSize: fontSizesInRem[80],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[92],
    fontFamily: fonts.heading
  },
  'heading/bold/72': {
    fontSize: fontSizesInRem[72],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[84],
    fontFamily: fonts.heading
  },
  'heading/regular/72': {
    fontSize: fontSizesInRem[72],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[84],
    fontFamily: fonts.heading
  },
  'heading/bold/64': {
    fontSize: fontSizesInRem[64],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[76],
    fontFamily: fonts.heading
  },
  'heading/regular/64': {
    fontSize: fontSizesInRem[64],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[76],
    fontFamily: fonts.heading
  },
  'heading/bold/56': {
    fontSize: fontSizesInRem[56],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[72],
    fontFamily: fonts.heading
  },
  'heading/regular/56': {
    fontSize: fontSizesInRem[56],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[72],
    fontFamily: fonts.heading
  },
  'heading/bold/48': {
    fontSize: fontSizesInRem[48],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[72],
    fontFamily: fonts.heading
  },
  'heading/regular/48': {
    fontSize: fontSizesInRem[48],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[72],
    fontFamily: fonts.heading
  },
  'heading/bold/40': {
    fontSize: fontSizesInRem[40],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[60],
    fontFamily: fonts.heading
  },
  'heading/regular/40': {
    fontSize: fontSizesInRem[40],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[60],
    fontFamily: fonts.heading
  },
  'heading/bold/32': {
    fontSize: fontSizesInRem[32],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[48],
    fontFamily: fonts.heading
  },
  'heading/regular/32': {
    fontSize: fontSizesInRem[32],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[48],
    fontFamily: fonts.heading
  },
  'heading/bold/24': {
    fontSize: fontSizesInRem[24],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[36],
    fontFamily: fonts.heading
  },
  'heading/regular/24': {
    fontSize: fontSizesInRem[24],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[36],
    fontFamily: fonts.heading
  },
  'heading/bold/20': {
    fontSize: fontSizesInRem[20],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.heading
  },
  'heading/regular/20': {
    fontSize: fontSizesInRem[20],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.heading
  },
  'heading/bold/18': {
    fontSize: fontSizesInRem[18],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.heading
  },
  'heading/regular/18': {
    fontSize: fontSizesInRem[18],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.heading
  },
  'heading/bold/16': {
    fontSize: fontSizesInRem[16],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[24],
    fontFamily: fonts.heading
  },
  'heading/regular/16': {
    fontSize: fontSizesInRem[16],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[24],
    fontFamily: fonts.heading
  },
  'heading/bold/14': {
    fontSize: fontSizesInRem[14],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[20],
    fontFamily: fonts.heading
  },
  'heading/regular/14': {
    fontSize: fontSizesInRem[14],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[20],
    fontFamily: fonts.heading
  },
  'heading/bold/12': {
    fontSize: fontSizesInRem[12],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[18],
    fontFamily: fonts.heading
  },
  'heading/regular/12': {
    fontSize: fontSizesInRem[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[18],
    fontFamily: fonts.heading
  },
  'body/regular/24': {
    fontSize: fontSizesInRem[24],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[36],
    fontFamily: fonts.body
  },
  'body/medium/24': {
    fontSize: fontSizesInRem[24],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[36],
    fontFamily: fonts.body
  },
  'body/bold/24': {
    fontSize: fontSizesInRem[24],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[36],
    fontFamily: fonts.body
  },
  'body/regular/20': {
    fontSize: fontSizesInRem[20],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.body
  },
  'body/medium/20': {
    fontSize: fontSizesInRem[20],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.body
  },
  'body/bold/20': {
    fontSize: fontSizesInRem[20],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.body
  },
  'body/regular/18': {
    fontSize: fontSizesInRem[18],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.body
  },
  'body/medium/18': {
    fontSize: fontSizesInRem[18],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.body
  },
  'body/bold/18': {
    fontSize: fontSizesInRem[18],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[28],
    fontFamily: fonts.body
  },
  'body/regular/16': {
    fontSize: fontSizesInRem[16],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[24],
    fontFamily: fonts.body
  },
  'body/medium/16': {
    fontSize: fontSizesInRem[16],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[24],
    fontFamily: fonts.body
  },
  'body/bold/16': {
    fontSize: fontSizesInRem[16],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[24],
    fontFamily: fonts.body
  },
  'body/regular/14': {
    fontSize: fontSizesInRem[14],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[20],
    fontFamily: fonts.body
  },
  'body/medium/14': {
    fontSize: fontSizesInRem[14],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[20],
    fontFamily: fonts.body
  },
  'body/bold/14': {
    fontSize: fontSizesInRem[14],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[20],
    fontFamily: fonts.body
  },
  'body/regular/12': {
    fontSize: fontSizesInRem[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[18],
    fontFamily: fonts.body
  },
  'body/medium/12': {
    fontSize: fontSizesInRem[12],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[18],
    fontFamily: fonts.body
  },
  'body/bold/12': {
    fontSize: fontSizesInRem[12],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeightsInRem[18],
    fontFamily: fonts.body
  },
  'label/medium/16': {
    fontSize: fontSizesInRem[16],
    fontWeight: fontWeights.medium,
    lineHeight: lineHeightsInRem[24],
    fontFamily: fonts.body
  },
  'label/regular/14': {
    fontSize: fontSizesInRem[14],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[20],
    fontFamily: fonts.body
  },
  'caption/regular/12': {
    fontSize: fontSizesInRem[12],
    fontWeight: fontWeights.regular,
    lineHeight: lineHeightsInRem[16],
    fontFamily: fonts.body
  }
} as const;
