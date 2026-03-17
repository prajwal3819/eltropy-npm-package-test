import { describe, it, expect, vi } from 'vitest';
import { PasswordInput } from './PasswordInput';
import { render, screen, fireEvent, waitFor } from '../../../test/test-utils';

const getPasswordInput = (container: HTMLElement) => {
  return container.querySelector(
    'input[type="password"], input[type="text"]'
  ) as HTMLInputElement;
};

describe('PasswordInput', () => {
  it('renders correctly with default props', () => {
    const { container } = render(<PasswordInput />);
    const input = getPasswordInput(container);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with label', () => {
    const { container } = render(<PasswordInput label="Password" />);
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders with subtext', () => {
    const { container } = render(
      <PasswordInput label="Password" subtext="Enter a strong password" />
    );
    expect(screen.getByText('Enter a strong password')).toBeInTheDocument();
  });

  it('renders required indicator when isRequired is true', () => {
    const { container } = render(<PasswordInput label="Password" isRequired />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders optional text when provided', () => {
    const { container } = render(
      <PasswordInput label="Password" optionalText="(Optional)" />
    );
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender, container } = render(<PasswordInput size="sm" />);
    let input = getPasswordInput(container);
    expect(input).toBeInTheDocument();

    rerender(<PasswordInput size="md" />);
    input = getPasswordInput(container);
    expect(input).toBeInTheDocument();

    rerender(<PasswordInput size="lg" />);
    input = getPasswordInput(container);
    expect(input).toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', () => {
    const { container } = render(<PasswordInput />);
    const input = getPasswordInput(container);
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not toggle password visibility when disabled', () => {
    const { container } = render(<PasswordInput disabled />);
    const input = getPasswordInput(container);
    const toggleButton = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('displays validation requirements by default', () => {
    const { container } = render(<PasswordInput />);
    expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument();
    expect(screen.getByText('1 uppercase')).toBeInTheDocument();
    expect(
      screen.getByText('At least 1 special character')
    ).toBeInTheDocument();
  });

  it('updates validation status as user types', async () => {
    const { container } = render(<PasswordInput />);
    const input = getPasswordInput(container);

    fireEvent.change(input, { target: { value: 'Pass' } });
    await waitFor(() => {
      expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'Password1!' } });
    await waitFor(() => {
      expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument();
    });
  });

  it('calls onValidityChange when validation state changes', async () => {
    const handleValidityChange = vi.fn();
    const { container } = render(
      <PasswordInput onValidityChange={handleValidityChange} />
    );
    const input = getPasswordInput(container);

    fireEvent.change(input, { target: { value: 'Password1!' } });

    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    const { container } = render(<PasswordInput onChange={handleChange} />);
    const input = getPasswordInput(container);

    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    const { container } = render(
      <PasswordInput error="Password is required" />
    );
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('hides validation requirements when error is shown', () => {
    const { container } = render(
      <PasswordInput error="Password is required" />
    );
    expect(screen.queryByText('Minimum 8 characters')).not.toBeInTheDocument();
  });

  it('hides validation requirements when disabled', () => {
    const { container } = render(<PasswordInput disabled />);
    expect(screen.queryByText('Minimum 8 characters')).not.toBeInTheDocument();
  });

  it('displays supporting text when provided', () => {
    render(
      <PasswordInput
        disabled
        supportingText="This field is currently disabled"
      />
    );
    expect(
      screen.getByText('This field is currently disabled')
    ).toBeInTheDocument();
  });

  it('applies aria-invalid when hasError is true', () => {
    const { container } = render(<PasswordInput error="Invalid password" />);
    const input = getPasswordInput(container);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies aria-invalid when isInvalid is true', () => {
    const { container } = render(<PasswordInput isInvalid />);
    const input = getPasswordInput(container);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies disabled attribute when disabled prop is true', () => {
    const { container } = render(<PasswordInput disabled />);
    const input = getPasswordInput(container);
    expect(input).toBeDisabled();
  });

  it('maintains focus when eye icon is clicked', () => {
    const { container } = render(<PasswordInput />);
    const input = getPasswordInput(container);
    const toggleButton = screen.getByRole('button');

    input.focus();
    expect(input).toHaveFocus();

    fireEvent.mouseDown(toggleButton);
    fireEvent.click(toggleButton);

    expect(input).toHaveFocus();
  });

  it('calls onFocus handler when input is focused', () => {
    const handleFocus = vi.fn();
    const { container } = render(<PasswordInput onFocus={handleFocus} />);
    const input = getPasswordInput(container);

    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalled();
  });

  it('calls onBlur handler when input loses focus', () => {
    const handleBlur = vi.fn();
    const { container } = render(<PasswordInput onBlur={handleBlur} />);
    const input = getPasswordInput(container);

    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
  });

  it('works as controlled component', () => {
    const { rerender, container } = render(<PasswordInput value="Test123!" />);
    const input = getPasswordInput(container) as HTMLInputElement;
    expect(input.value).toBe('Test123!');

    rerender(<PasswordInput value="NewPassword1!" />);
    expect(input.value).toBe('NewPassword1!');
  });

  it('works as uncontrolled component with defaultValue', () => {
    const { container } = render(
      <PasswordInput defaultValue="InitialPass1!" />
    );
    const input = getPasswordInput(container) as HTMLInputElement;
    expect(input.value).toBe('InitialPass1!');
  });

  it('validates password with minimum 8 characters', async () => {
    const handleValidityChange = vi.fn();
    const { container } = render(
      <PasswordInput onValidityChange={handleValidityChange} />
    );
    const input = getPasswordInput(container);

    fireEvent.change(input, { target: { value: 'Short1!' } });
    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(false);
    });

    fireEvent.change(input, { target: { value: 'LongPass1!' } });
    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it('validates password with uppercase letter', async () => {
    const handleValidityChange = vi.fn();
    const { container } = render(
      <PasswordInput onValidityChange={handleValidityChange} />
    );
    const input = getPasswordInput(container);

    fireEvent.change(input, { target: { value: 'password1!' } });
    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(false);
    });

    fireEvent.change(input, { target: { value: 'Password1!' } });
    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it('validates password with special character', async () => {
    const handleValidityChange = vi.fn();
    const { container } = render(
      <PasswordInput onValidityChange={handleValidityChange} />
    );
    const input = getPasswordInput(container);

    fireEvent.change(input, { target: { value: 'Password1' } });
    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(false);
    });

    fireEvent.change(input, { target: { value: 'Password1!' } });
    await waitFor(() => {
      expect(handleValidityChange).toHaveBeenCalledWith(true);
    });
  });
});
