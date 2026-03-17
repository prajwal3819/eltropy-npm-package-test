import { describe, it, expect, vi } from 'vitest';
import { SearchInput } from './SearchInput';
import { render, screen, fireEvent } from '../../../test/test-utils';

describe('SearchInput', () => {
  it('renders correctly with default props', () => {
    render(<SearchInput placeholder="Search here..." />);

    const input = screen.getByPlaceholderText('Search here...');
    expect(input).toBeInTheDocument();

    // Clear button should not be visible initially when empty
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles typing and updates value (uncontrolled)', () => {
    render(<SearchInput placeholder="Search..." />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'React' } });
    expect(input).toHaveValue('React');
  });

  it('renders with a defaultValue', () => {
    render(<SearchInput defaultValue="Initial query" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('Initial query');
    // Clear button should be visible because there is text
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows clear button only when input has a value', () => {
    const { rerender } = render(<SearchInput value="" onChange={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(<SearchInput value="Has text" onChange={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('clears the input, calls onClear, and refocuses when clear button is clicked', () => {
    const onClearMock = vi.fn();
    render(<SearchInput defaultValue="To be cleared" onClear={onClearMock} />);

    const input = screen.getByRole('textbox');
    const clearButton = screen.getByRole('button');

    expect(input).toHaveValue('To be cleared');

    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
    expect(onClearMock).toHaveBeenCalledTimes(1);
    expect(input).toHaveFocus();
  });

  it('calls onChange handler when typing', () => {
    const onChangeMock = vi.fn();
    render(<SearchInput onChange={onChangeMock} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello' } });

    expect(onChangeMock).toHaveBeenCalledWith('Hello');
  });

  it('calls onFocus and onBlur handlers', () => {
    const onFocusMock = vi.fn();
    const onBlurMock = vi.fn();
    render(<SearchInput onFocus={onFocusMock} onBlur={onBlurMock} />);

    const input = screen.getByRole('textbox');

    fireEvent.focus(input);
    expect(onFocusMock).toHaveBeenCalledTimes(1);

    fireEvent.blur(input);
    expect(onBlurMock).toHaveBeenCalledTimes(1);
  });

  it('renders error message and invalid state correctly', () => {
    render(
      <SearchInput
        isInvalid
        errorMessage="Special characters are not allowed"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('data-invalid', '');

    // Check if error message is rendered
    expect(
      screen.getByText('Special characters are not allowed')
    ).toBeInTheDocument();
  });

  it('does not render error text if isInvalid is true but no errorMessage is provided', () => {
    const { container } = render(<SearchInput isInvalid />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    // The error text container should not be in the document
    // (Assuming the text is the only thing rendering the ErrorCircleIcon block)
    expect(container.textContent).toBe('');
  });

  it('handles disabled state correctly', () => {
    render(<SearchInput disabled defaultValue="Disabled text" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');

    // Clear button should also be disabled
    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeDisabled();
  });

  it('passes data-focus and data-hover attributes to the search icon based on input interactions', () => {
    const { container } = render(<SearchInput />);
    const input = screen.getByRole('textbox');

    // SearchIcon is the first SVG/Box in the icon container.
    // We check the DOM directly for the data attributes passed down.
    const searchIconWrapper = container.querySelector('[left="12px"] > *');

    // Initial state
    expect(searchIconWrapper).not.toHaveAttribute('data-focus');
    expect(searchIconWrapper).not.toHaveAttribute('data-hover');

    // Focus
    fireEvent.focus(input);
    expect(searchIconWrapper).toHaveAttribute('data-focus');

    // Hover
    fireEvent.mouseEnter(input);
    expect(searchIconWrapper).toHaveAttribute('data-hover');

    // Un-hover and Blur
    fireEvent.mouseLeave(input);
    fireEvent.blur(input);
    expect(searchIconWrapper).not.toHaveAttribute('data-hover');
    expect(searchIconWrapper).not.toHaveAttribute('data-focus');
  });
});
