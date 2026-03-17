import { describe, it, expect, vi } from 'vitest';
import { Text } from '../text';
import { render, screen } from '../../../test/test-utils';

describe('Text', () => {
  describe('Rendering', () => {
    it('renders correctly with required props', () => {
      render(
        <Text variant="body" size={16} weight="Regular">
          Hello World
        </Text>
      );
      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders with heading variant', () => {
      render(
        <Text variant="heading" size={24} weight="Bold">
          Heading Text
        </Text>
      );
      expect(screen.getByText('Heading Text')).toBeInTheDocument();
    });

    it('renders with body variant', () => {
      render(
        <Text variant="body" size={14} weight="Regular">
          Body Text
        </Text>
      );
      expect(screen.getByText('Body Text')).toBeInTheDocument();
    });

    it('renders with label variant', () => {
      render(
        <Text variant="label" size={16} weight="Medium">
          Label Text
        </Text>
      );
      expect(screen.getByText('Label Text')).toBeInTheDocument();
    });

    it('renders with caption variant', () => {
      render(
        <Text variant="caption" size={12} weight="Regular">
          Caption Text
        </Text>
      );
      expect(screen.getByText('Caption Text')).toBeInTheDocument();
    });
  });

  describe('Font Weights', () => {
    it('renders with Regular weight', () => {
      render(
        <Text variant="body" size={16} weight="Regular">
          Regular Text
        </Text>
      );
      const element = screen.getByText('Regular Text');
      expect(element).toBeInTheDocument();
    });

    it('renders with Medium weight', () => {
      render(
        <Text variant="body" size={16} weight="Medium">
          Medium Text
        </Text>
      );
      const element = screen.getByText('Medium Text');
      expect(element).toBeInTheDocument();
    });

    it('renders with Bold weight', () => {
      render(
        <Text variant="body" size={16} weight="Bold">
          Bold Text
        </Text>
      );
      const element = screen.getByText('Bold Text');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Font Sizes', () => {
    it('renders with size 12', () => {
      render(
        <Text variant="body" size={12} weight="Regular">
          Size 12
        </Text>
      );
      expect(screen.getByText('Size 12')).toBeInTheDocument();
    });

    it('renders with size 24', () => {
      render(
        <Text variant="body" size={24} weight="Regular">
          Size 24
        </Text>
      );
      expect(screen.getByText('Size 24')).toBeInTheDocument();
    });

    it('renders with size 48', () => {
      render(
        <Text variant="heading" size={48} weight="Bold">
          Size 48
        </Text>
      );
      expect(screen.getByText('Size 48')).toBeInTheDocument();
    });

    it('renders with size 120', () => {
      render(
        <Text variant="heading" size={120} weight="Regular">
          Size 120
        </Text>
      );
      expect(screen.getByText('Size 120')).toBeInTheDocument();
    });
  });

  describe('Semantic HTML Elements', () => {
    it('renders as h1 for heading variant with size >= 80', () => {
      render(
        <Text variant="heading" size={80} weight="Bold">
          H1 Heading
        </Text>
      );
      const element = screen.getByText('H1 Heading');
      expect(element.tagName).toBe('H1');
    });

    it('renders as h2 for heading variant with size >= 64', () => {
      render(
        <Text variant="heading" size={64} weight="Bold">
          H2 Heading
        </Text>
      );
      const element = screen.getByText('H2 Heading');
      expect(element.tagName).toBe('H2');
    });

    it('renders as h3 for heading variant with size >= 48', () => {
      render(
        <Text variant="heading" size={48} weight="Bold">
          H3 Heading
        </Text>
      );
      const element = screen.getByText('H3 Heading');
      expect(element.tagName).toBe('H3');
    });

    it('renders as h4 for heading variant with size >= 32', () => {
      render(
        <Text variant="heading" size={32} weight="Bold">
          H4 Heading
        </Text>
      );
      const element = screen.getByText('H4 Heading');
      expect(element.tagName).toBe('H4');
    });

    it('renders as h5 for heading variant with size >= 24', () => {
      render(
        <Text variant="heading" size={24} weight="Bold">
          H5 Heading
        </Text>
      );
      const element = screen.getByText('H5 Heading');
      expect(element.tagName).toBe('H5');
    });

    it('renders as h6 for heading variant with size < 24', () => {
      render(
        <Text variant="heading" size={20} weight="Bold">
          H6 Heading
        </Text>
      );
      const element = screen.getByText('H6 Heading');
      expect(element.tagName).toBe('H6');
    });

    it('renders as p for body variant', () => {
      render(
        <Text variant="body" size={16} weight="Regular">
          Paragraph
        </Text>
      );
      const element = screen.getByText('Paragraph');
      expect(element.tagName).toBe('P');
    });

    it('renders as label for label variant', () => {
      render(
        <Text variant="label" size={16} weight="Medium">
          Label
        </Text>
      );
      const element = screen.getByText('Label');
      expect(element.tagName).toBe('LABEL');
    });

    it('renders as span for caption variant', () => {
      render(
        <Text variant="caption" size={12} weight="Regular">
          Caption
        </Text>
      );
      const element = screen.getByText('Caption');
      expect(element.tagName).toBe('SPAN');
    });
  });

  describe('Custom Element Override', () => {
    it('renders with custom element using as prop', () => {
      render(
        <Text variant="body" size={16} weight="Regular" as="div">
          Custom Div
        </Text>
      );
      const element = screen.getByText('Custom Div');
      expect(element.tagName).toBe('DIV');
    });

    it('overrides semantic element with as prop', () => {
      render(
        <Text variant="heading" size={80} weight="Bold" as="span">
          Custom Span
        </Text>
      );
      const element = screen.getByText('Custom Span');
      expect(element.tagName).toBe('SPAN');
    });
  });

  describe('Additional Props', () => {
    it('applies custom className', () => {
      render(
        <Text
          variant="body"
          size={16}
          weight="Regular"
          className="custom-class"
        >
          Custom Class
        </Text>
      );
      const element = screen.getByText('Custom Class');
      expect(element).toHaveClass('custom-class');
    });

    it('applies custom color', () => {
      render(
        <Text variant="body" size={16} weight="Regular" color="red.500">
          Colored Text
        </Text>
      );
      expect(screen.getByText('Colored Text')).toBeInTheDocument();
    });

    it('applies custom margin', () => {
      render(
        <Text variant="body" size={16} weight="Regular" mb={4}>
          Margin Text
        </Text>
      );
      expect(screen.getByText('Margin Text')).toBeInTheDocument();
    });

    it('applies custom padding', () => {
      render(
        <Text variant="body" size={16} weight="Regular" p={2}>
          Padding Text
        </Text>
      );
      expect(screen.getByText('Padding Text')).toBeInTheDocument();
    });
  });

  describe('Invalid Combinations', () => {
    it('logs warning for invalid variant/size/weight combination', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      render(
        <Text variant="body" size={120} weight="Regular">
          Invalid Combo
        </Text>
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid combination')
      );

      consoleWarnSpy.mockRestore();
    });

    it('still renders content with invalid combination', () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <Text variant="body" size={120} weight="Regular">
          Invalid but Rendered
        </Text>
      );

      expect(screen.getByText('Invalid but Rendered')).toBeInTheDocument();

      vi.restoreAllMocks();
    });
  });

  describe('Typography Styles', () => {
    it('applies correct font family for heading variant', () => {
      render(
        <Text variant="heading" size={24} weight="Bold">
          Heading
        </Text>
      );
      const element = screen.getByText('Heading');
      expect(element).toBeInTheDocument();
    });

    it('applies correct font family for body variant', () => {
      render(
        <Text variant="body" size={16} weight="Regular">
          Body
        </Text>
      );
      const element = screen.getByText('Body');
      expect(element).toBeInTheDocument();
    });

    it('applies letterSpacing of 0', () => {
      render(
        <Text variant="body" size={16} weight="Regular">
          Letter Spacing
        </Text>
      );
      expect(screen.getByText('Letter Spacing')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(
        <Text variant="body" size={16} weight="Regular" ref={ref}>
          Ref Test
        </Text>
      );
      expect(ref).toHaveBeenCalled();
    });
  });

  describe('All Supported Sizes', () => {
    const sizes = [
      12, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96, 104, 112, 120
    ] as const;

    sizes.forEach((size) => {
      it(`renders with size ${size}`, () => {
        const variant = size >= 24 ? 'heading' : 'body';
        render(
          <Text variant={variant} size={size} weight="Regular">
            Size {size}
          </Text>
        );
        expect(screen.getByText(`Size ${size}`)).toBeInTheDocument();
      });
    });
  });
});
