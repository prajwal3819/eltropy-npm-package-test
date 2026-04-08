# Eltropy Design System Setup Guide

## Initial Setup

### 1. Install Dependencies

```bash
cd /opt/eltropy/repo/elt-design-system
npm install
```

### 2. Verify Installation

Check that all dependencies are installed correctly:

```bash
npm list --depth=0
```

## Development Workflow

### Run Development Server

Start the Vite development server to see the demo app:

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Run Storybook

Start Storybook for component development and documentation:

```bash
npm run storybook
```

Open http://localhost:6006 in your browser.

## Building the Library

### Build for Distribution

Build the library for npm distribution:

```bash
npm run build:lib
```

This will:
- Compile TypeScript to JavaScript
- Generate type definitions (.d.ts files)
- Bundle the library using Vite
- Output to the `dist/` directory

### Build Storybook

Build a static version of Storybook:

```bash
npm run build-storybook
```

Output will be in `storybook-static/` directory.

## GitHub Package Registry Setup

### For Package Consumers

1. Create a GitHub Personal Access Token with `read:packages` scope
2. Add to your `~/.npmrc`:

```
@eltropy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

3. Install the package:

```bash
npm install @eltropy/design-system
```

### For Package Publishers

1. Create a GitHub Personal Access Token with `write:packages` scope
2. Set the token as `NODE_AUTH_TOKEN` environment variable
3. Build and publish:

```bash
npm run build:lib
npm publish
```

## GitHub Actions

### Automatic Publishing

The package is automatically published when you create a new GitHub release:

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version (e.g., `v1.0.0`)
4. Publish release
5. GitHub Actions will automatically build and publish to GitHub Packages

### Storybook Deployment

Storybook is automatically deployed to `https://eltropy.storybook.com` on every push to `main`:

## Project Structure

```
elt-design-system/
├── .github/
│   └── workflows/          # GitHub Actions workflows
│       ├── publish.yml     # Package publishing
│       └── storybook.yml   # Storybook deployment
├── .storybook/             # Storybook configuration
│   ├── main.ts
│   └── preview.tsx
├── src/
│   ├── components/         # React components
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       └── index.ts
│   ├── theme/              # Design system theme
│   │   ├── tokens/         # Design tokens
│   │   ├── foundations/    # Chakra foundations
│   │   ├── theme.ts        # Main theme
│   │   └── index.ts
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utilities
│   ├── models/             # TypeScript types
│   └── index.ts            # Main entry point
├── .npmrc                  # NPM registry configuration
├── package.json            # Package configuration
├── tsconfig.lib.json       # TypeScript config for library
├── vite.config.ts          # Vite configuration
└── README.md               # Documentation
```

## Adding New Components

### 1. Create Component Files

```bash
mkdir -p src/components/NewComponent
```

Create the following files:
- `NewComponent.tsx` - Component implementation
- `NewComponent.stories.tsx` - Storybook stories
- `index.ts` - Exports

### 2. Component Template

```tsx
// NewComponent.tsx
import { forwardRef } from 'react';
import type { ComponentProps } from '@chakra-ui/react';

export interface NewComponentProps extends ComponentProps<'div'> {
  // Your props
}

export const NewComponent = forwardRef<HTMLDivElement, NewComponentProps>(
  (props, ref) => {
    return <div ref={ref} {...props} />;
  }
);

NewComponent.displayName = 'NewComponent';
```

### 3. Storybook Story Template

```tsx
// NewComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { NewComponent } from './NewComponent';

const meta = {
  title: 'Components/NewComponent',
  component: NewComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NewComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

### 4. Export Component

Add to `src/components/index.ts`:

```tsx
export * from './NewComponent';
```

## Design Tokens

Design tokens are located in `src/theme/tokens/`:

- **colors.ts** - Color palette and semantic colors
- **typography.ts** - Font families, sizes, weights, line heights
- **spacing.ts** - Spacing scale, sizes, and border radii

To modify tokens, edit these files and the theme will automatically update.

## Testing

### Run Linter

```bash
npm run lint
```

