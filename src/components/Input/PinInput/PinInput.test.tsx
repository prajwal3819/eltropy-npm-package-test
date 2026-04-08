import { describe, it, expect, vi } from 'vitest';
import { PinInput } from './PinInput';
import { render, screen, fireEvent } from '../../../test/test-utils';

describe('PinInput', () => {
  it('renders correctly with default props (6 inputs)', () => {
    render(<PinInput />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('renders with a custom length', () => {
    render(<PinInput length={4} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);
  });

  it('renders with different sizes without crashing', () => {
    const { rerender } = render(<PinInput size="sm" />);
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();

    rerender(<PinInput size="lg" />);
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
  });

  it('displays the error message when provided', () => {
    render(<PinInput error="Entered code is wrong" />);

    // Check if the text is rendered
    expect(screen.getByText('Entered code is wrong')).toBeInTheDocument();

    // Check if inputs receive the invalid aria attribute
    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0]).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables all input fields when disabled prop is passed', () => {
    render(<PinInput disabled />);
    const inputs = screen.getAllByRole('textbox');

    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('calls onChange handler when typing', () => {
    const handleChange = vi.fn();
    render(<PinInput onChange={handleChange} />);

    const firstInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(firstInput, { target: { value: '5' } });

    // Chakra's internal PinInput handles the exact payload, but we ensure our wrapper forwards it
    expect(handleChange).toHaveBeenCalled();
  });
});
