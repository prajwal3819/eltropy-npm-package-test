import { describe, it, expect, vi } from 'vitest';
import { TextInput } from './TextInput';
import { render, screen, fireEvent } from '../../../test/test-utils';

describe('TextInput', () => {
  it('renders correctly with default props', () => {
    render(<TextInput placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<TextInput size="sm" placeholder="Small" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(<TextInput size="md" placeholder="Medium" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    rerender(<TextInput size="lg" placeholder="Large" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label and required indicator', () => {
    render(<TextInput label="Username" isRequired />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with optional text', () => {
    render(<TextInput label="Email" optionalText="(Optional)" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('renders with subtext', () => {
    render(
      <TextInput label="Password" subtext="Must be at least 8 characters" />
    );
    expect(
      screen.getByText('Must be at least 8 characters')
    ).toBeInTheDocument();
  });

  it('renders with supporting text', () => {
    render(<TextInput supportingText="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<TextInput error="This field is invalid" />);
    expect(screen.getByText('This field is invalid')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders with left icon', () => {
    render(
      <TextInput
        leftIcon={<span data-testid="left-icon">🔍</span>}
        placeholder="Search"
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(
      <TextInput
        rightIcon={<span data-testid="right-icon">→</span>}
        placeholder="Enter"
      />
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onRightIconClick when right icon is clicked', () => {
    const handleClick = vi.fn();
    render(
      <TextInput
        rightIcon={<span>→</span>}
        onRightIconClick={handleClick}
        placeholder="Click icon"
      />
    );

    const iconButton = screen.getByRole('button'); // The right icon is a button
    fireEvent.click(iconButton);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onRightIconClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <TextInput
        disabled
        rightIcon={<span>→</span>}
        onRightIconClick={handleClick}
        placeholder="Disabled"
      />
    );

    const iconButton = screen.getByRole('button');
    fireEvent.click(iconButton);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles disabled state correctly', () => {
    render(<TextInput disabled placeholder="Disabled input" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles invalid state correctly', () => {
    render(<TextInput isInvalid placeholder="Invalid input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
