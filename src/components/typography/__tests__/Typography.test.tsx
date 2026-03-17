import { describe, it, expect, vi } from 'vitest';
import { Typography } from '../typography';
import { render, screen, fireEvent } from '../../../test/test-utils';

describe('Typography', () => {
  describe('Rendering', () => {
    it('renders correctly with children', () => {
      render(<Typography>Hello World</Typography>);
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders as a div by default', () => {
      render(<Typography>Default Element</Typography>);
      const element = screen.getByText('Default Element');
      expect(element.tagName).toBe('DIV');
    });

    it('renders with custom element using as prop', () => {
      render(<Typography as="span">Custom Span</Typography>);
      const element = screen.getByText('Custom Span');
      expect(element.tagName).toBe('SPAN');
    });

    it('renders with custom element as p', () => {
      render(<Typography as="p">Paragraph</Typography>);
      const element = screen.getByText('Paragraph');
      expect(element.tagName).toBe('P');
    });

    it('renders with custom element as h1', () => {
      render(<Typography as="h1">Heading 1</Typography>);
      const element = screen.getByText('Heading 1');
      expect(element.tagName).toBe('H1');
    });
  });

  describe('Style Props', () => {
    it('applies fontSize prop', () => {
      render(<Typography fontSize="24px">Large Text</Typography>);
      expect(screen.getByText('Large Text')).toBeInTheDocument();
    });

    it('applies fontWeight prop', () => {
      render(<Typography fontWeight="bold">Bold Text</Typography>);
      expect(screen.getByText('Bold Text')).toBeInTheDocument();
    });

    it('applies color prop', () => {
      render(<Typography color="red.500">Red Text</Typography>);
      expect(screen.getByText('Red Text')).toBeInTheDocument();
    });

    it('applies lineHeight prop', () => {
      render(<Typography lineHeight="1.5">Line Height</Typography>);
      expect(screen.getByText('Line Height')).toBeInTheDocument();
    });

    it('applies fontFamily prop', () => {
      render(<Typography fontFamily="monospace">Monospace</Typography>);
      expect(screen.getByText('Monospace')).toBeInTheDocument();
    });

    it('applies letterSpacing prop', () => {
      render(<Typography letterSpacing="0.1em">Letter Spacing</Typography>);
      expect(screen.getByText('Letter Spacing')).toBeInTheDocument();
    });

    it('applies textAlign prop', () => {
      render(<Typography textAlign="center">Centered</Typography>);
      expect(screen.getByText('Centered')).toBeInTheDocument();
    });

    it('applies textTransform prop', () => {
      render(<Typography textTransform="uppercase">Uppercase</Typography>);
      expect(screen.getByText('Uppercase')).toBeInTheDocument();
    });
  });

  describe('Layout Props', () => {
    it('applies margin props', () => {
      render(
        <Typography m={4} mt={2} mb={3} ml={1} mr={5}>
          Margin
        </Typography>
      );
      expect(screen.getByText('Margin')).toBeInTheDocument();
    });

    it('applies padding props', () => {
      render(
        <Typography p={4} pt={2} pb={3} pl={1} pr={5}>
          Padding
        </Typography>
      );
      expect(screen.getByText('Padding')).toBeInTheDocument();
    });

    it('applies width prop', () => {
      render(<Typography width="100%">Full Width</Typography>);
      expect(screen.getByText('Full Width')).toBeInTheDocument();
    });

    it('applies height prop', () => {
      render(<Typography height="50px">Fixed Height</Typography>);
      expect(screen.getByText('Fixed Height')).toBeInTheDocument();
    });

    it('applies maxWidth prop', () => {
      render(<Typography maxWidth="500px">Max Width</Typography>);
      expect(screen.getByText('Max Width')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      render(<Typography className="custom-class">Custom Class</Typography>);
      const element = screen.getByText('Custom Class');
      expect(element).toHaveClass('custom-class');
    });

    it('applies custom id', () => {
      render(<Typography id="custom-id">Custom ID</Typography>);
      const element = screen.getByText('Custom ID');
      expect(element).toHaveAttribute('id', 'custom-id');
    });

    it('applies data attributes', () => {
      render(
        <Typography data-testid="custom-typography" data-value="test">
          Data Attributes
        </Typography>
      );
      const element = screen.getByTestId('custom-typography');
      expect(element).toHaveAttribute('data-value', 'test');
    });

    it('applies aria attributes', () => {
      render(
        <Typography aria-label="Custom Label" aria-describedby="description">
          Aria Attributes
        </Typography>
      );
      const element = screen.getByText('Aria Attributes');
      expect(element).toHaveAttribute('aria-label', 'Custom Label');
      expect(element).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('Event Handlers', () => {
    it('handles onClick event', () => {
      const handleClick = vi.fn();
      render(<Typography onClick={handleClick}>Click Me</Typography>);
      const element = screen.getByText('Click Me');
      element.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles onMouseEnter event', () => {
      const handleMouseEnter = vi.fn();
      render(<Typography onMouseEnter={handleMouseEnter}>Hover Me</Typography>);
      const element = screen.getByText('Hover Me');
      fireEvent.mouseEnter(element);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    });

    it('handles onMouseLeave event', () => {
      const handleMouseLeave = vi.fn();
      render(<Typography onMouseLeave={handleMouseLeave}>Leave Me</Typography>);
      const element = screen.getByText('Leave Me');
      fireEvent.mouseLeave(element);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Typography ref={ref}>Ref Test</Typography>);
      expect(ref).toHaveBeenCalled();
    });

    it('ref points to correct element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<Typography ref={ref}>Ref Element</Typography>);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.textContent).toBe('Ref Element');
    });
  });

  describe('Multiple Children', () => {
    it('renders multiple children', () => {
      render(
        <Typography>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </Typography>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('renders nested elements', () => {
      render(
        <Typography>
          <div>
            <span>Nested</span>
          </div>
        </Typography>
      );
      expect(screen.getByText('Nested')).toBeInTheDocument();
    });
  });

  describe('Responsive Props', () => {
    it('applies responsive fontSize', () => {
      render(
        <Typography fontSize={{ base: '14px', md: '16px', lg: '18px' }}>
          Responsive Font
        </Typography>
      );
      expect(screen.getByText('Responsive Font')).toBeInTheDocument();
    });

    it('applies responsive padding', () => {
      render(
        <Typography p={{ base: 2, md: 4, lg: 6 }}>
          Responsive Padding
        </Typography>
      );
      expect(screen.getByText('Responsive Padding')).toBeInTheDocument();
    });

    it('applies responsive margin', () => {
      render(
        <Typography m={{ base: 1, md: 2, lg: 3 }}>Responsive Margin</Typography>
      );
      expect(screen.getByText('Responsive Margin')).toBeInTheDocument();
    });
  });

  describe('Display Name', () => {
    it('has correct display name', () => {
      expect(Typography.displayName).toBe('Typography');
    });
  });

  describe('Complex Styling', () => {
    it('applies multiple style props together', () => {
      render(
        <Typography
          fontSize="20px"
          fontWeight="bold"
          color="blue.500"
          lineHeight="1.5"
          letterSpacing="0.05em"
          textAlign="center"
          p={4}
          m={2}
        >
          Complex Styles
        </Typography>
      );
      expect(screen.getByText('Complex Styles')).toBeInTheDocument();
    });

    it('combines layout and typography props', () => {
      render(
        <Typography
          as="p"
          fontSize="16px"
          fontWeight="500"
          maxWidth="600px"
          mx="auto"
          py={4}
        >
          Combined Props
        </Typography>
      );
      const element = screen.getByText('Combined Props');
      expect(element.tagName).toBe('P');
    });
  });
});
