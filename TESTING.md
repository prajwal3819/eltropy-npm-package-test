# Testing Guide for Radiant V2

This guide explains how to write and run tests for the Radiant V2 component library.

## Testing Framework

Radiant V2 uses the following testing tools:

- **Vitest**: A fast Vite-based testing framework
- **React Testing Library**: For testing React components in a user-centric way
- **@testing-library/jest-dom**: For additional DOM matchers

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test File Structure

Tests should be placed alongside the component they test with a `.test.tsx` or `.spec.tsx` extension:

```
src/
  components/
    Button/
      Button.tsx
      Button.test.tsx  # Test file for Button component
```

## Writing Tests

### Basic Component Test

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Testing Chakra UI Components

Use the custom `render` function from `test-utils.tsx` which wraps components with the Chakra UI provider:

```tsx
import { render, screen } from '../../test/test-utils';

// This will render the component with Chakra UI context
render(<YourComponent />);
```

### Testing Events

```tsx
import { fireEvent } from '../../test/test-utils';

it('handles click events', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Different Props

```tsx
it('renders with different variants', () => {
  const { rerender } = render(<Button variant="primary">Primary</Button>);
  
  // Test first render
  expect(screen.getByRole('button')).toBeInTheDocument();
  
  // Re-render with different props
  rerender(<Button variant="outlined">Outlined</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

## Best Practices

1. **Test behavior, not implementation**: Focus on what the user sees and interacts with
2. **Use accessible queries**: Prefer `getByRole`, `getByLabelText`, and `getByText` over `getByTestId`
3. **Test accessibility**: Ensure components are accessible by using proper ARIA roles
4. **Keep tests simple**: Each test should verify one specific aspect of the component
5. **Avoid snapshot tests**: They're fragile and don't communicate intent clearly

## Mocking

For mocking external dependencies or complex behaviors:

```tsx
import { vi } from 'vitest';

// Mock a module
vi.mock('some-module', () => ({
  someFunction: vi.fn().mockReturnValue('mocked value')
}));

// Mock a function
const mockFn = vi.fn();
mockFn.mockReturnValue('mocked result');
```

## Coverage Reports

After running `npm run test:coverage`, view the coverage report in the `coverage` directory.
