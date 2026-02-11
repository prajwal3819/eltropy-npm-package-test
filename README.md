# UI Component Library

A modern React component library built with Storybook and published to GitHub Packages.

## Features

- 🎨 Beautiful, accessible components
- 📚 Interactive documentation with Storybook
- 🚀 Built with modern React (v18+)
- 🧪 Full test coverage
- 📦 Published as an npm package

## Installation

```bash
# Using npm
npm install @prajwal3819/eltropy-npm-package-test

# Using yarn
yarn add @prajwal3819/eltropy-npm-package-test
```

## Usage

```jsx
import { Button, Card, Badge } from '@prajwal3819/eltropy-npm-package-test';

function App() {
  return (
    <Card title="Welcome">
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Click me
      </Button>
      <Badge text="New" color="blue" />
    </Card>
  );
}
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Storybook:
   ```bash
   npm run storybook
   ```
4. Build the library:
   ```bash
   npm run build
   ```

## Testing

```bash
npm test
```

## Publishing

New versions are automatically published when tags are pushed to the `main` branch. The version is determined by the git tag.

## License

MIT
