import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';

/**
 * Custom render function that includes Chakra UI Provider
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllProviders, ...options });

/**
 * Provider wrapper for tests
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  return <ChakraProvider value={theme}>{children}</ChakraProvider>;
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };
