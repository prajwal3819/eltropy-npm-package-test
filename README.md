# Eltropy Design System

A modern React component library built with Chakra UI v3, TypeScript, and Vite. This is a complete rewrite of the Radiant UI library with updated design tokens and components.

## Features

- 🎨 **Modern Design Tokens** - Complete design system with colors, typography, spacing, and more
- ⚡ **Chakra UI v3** - Built on the latest Chakra UI with improved performance
- 📦 **TypeScript** - Full type safety and IntelliSense support
- 📚 **Storybook** - Interactive component documentation
- 🔧 **Vite** - Fast development and optimized builds
- 📖 **Private NPM** - Published to GitHub Packages

## Installation

```bash
npm install @eltropy/design-system
```

### GitHub Package Registry Setup

Add the following to your `.npmrc` file:

```
@eltropy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Usage

### Basic Setup

```tsx
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@eltropy/design-system';

function App() {
  return (
    <ChakraProvider value={theme}>
      {/* Your app */}
    </ChakraProvider>
  );
}
```

### Using Components

```tsx
import { Button } from '@eltropy/design-system';

function MyComponent() {
  return (
    <Button colorScheme="green" variant="solid">
      Click me
    </Button>
  );
}
```

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Run Storybook

```bash
npm run storybook
```

### Build Library

```bash
npm run build:lib
```

### Build Storybook

```bash
npm run build-storybook
```

## Project Structure

```
src/
├── components/     # React components
├── theme/          # Design tokens and theme configuration
│   ├── tokens/     # Raw design tokens (colors, typography, spacing)
│   ├── foundations/# Chakra UI foundations
│   └── theme.ts    # Main theme configuration
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── models/         # TypeScript types and interfaces
└── assets/         # Static assets
```

## Design Tokens

The library includes comprehensive design tokens:

- **Colors**: Green, Blue, Gray, Navy Gray, Violet, Yellow, Success Green, Red, Orange
- **Typography**: ABC Diatype font family with various sizes and weights
- **Spacing**: Consistent spacing scale from 0 to 80px
- **Radii**: Border radius tokens from 0 to 48px

## Publishing

The package is automatically published to GitHub Packages when a new release is created.

### Manual Publish

```bash
npm run build:lib
npm publish
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Add Storybook stories for new components
4. Submit a pull request

## License

MIT
