import { describe, it, expect } from 'vitest';
import { PhoneInput } from './PhoneInput';
import { render, screen, fireEvent } from '../../../test/test-utils';

describe('PhoneInput', () => {
  it('renders correctly with default props', () => {
    const { container } = render(
      <PhoneInput placeholder="Enter phone number" />
    );
    const input = screen.getByPlaceholderText('Enter phone number');

    expect(input).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument(); // Default US dial code
    expect(container.querySelector('.fflag-US')).toBeInTheDocument(); // Default US flag CSS class
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<PhoneInput size="sm" placeholder="Small" />);
    expect(screen.getByPlaceholderText('Small')).toBeInTheDocument();

    rerender(<PhoneInput size="md" placeholder="Medium" />);
    expect(screen.getByPlaceholderText('Medium')).toBeInTheDocument();

    rerender(<PhoneInput size="lg" placeholder="Large" />);
    expect(screen.getByPlaceholderText('Large')).toBeInTheDocument();
  });

  it('renders with label and required indicator', () => {
    render(<PhoneInput label="Phone Number" isRequired />);
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with optional text', () => {
    render(<PhoneInput label="Mobile" optionalText="(Optional)" />);
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('(Optional)')).toBeInTheDocument();
  });

  it('renders with subtext', () => {
    render(<PhoneInput label="Contact" subtext="For verification purposes" />);
    expect(screen.getByText('For verification purposes')).toBeInTheDocument();
  });

  it('renders with supporting text', () => {
    render(<PhoneInput supportingText="Include country code" />);
    expect(screen.getByText('Include country code')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    render(<PhoneInput error="Invalid phone number" placeholder="Phone" />);
    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  });

  it('opens country dropdown when trigger is clicked', () => {
    render(<PhoneInput />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    // Assuming 'Japan' is a valid option in your Dropdown
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  it('changes selected country when country is selected from dropdown', () => {
    const { container } = render(<PhoneInput />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const japanOption = screen.getByText('Japan');
    fireEvent.click(japanOption);

    expect(screen.getByText('+81')).toBeInTheDocument();
    expect(container.querySelector('.fflag-JP')).toBeInTheDocument();
  });

  it('filters countries based on search query', () => {
    render(<PhoneInput />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText('Search default');
    fireEvent.change(searchInput, { target: { value: 'Japan' } });

    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('closes dropdown after country selection', () => {
    render(<PhoneInput />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const japanOption = screen.getByText('Japan');
    fireEvent.click(japanOption);

    expect(
      screen.queryByPlaceholderText('Search default')
    ).not.toBeInTheDocument();
  });

  it('handles disabled state correctly', () => {
    render(<PhoneInput disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();

    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles invalid state correctly', () => {
    render(<PhoneInput isInvalid placeholder="Invalid input" />);
    const input = screen.getByPlaceholderText('Invalid input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('filters countries using onlyCountries prop', () => {
    render(<PhoneInput onlyCountries={['jp', 'gb']} />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();

    // Verify US is excluded
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('filters countries using excludeCountries prop', () => {
    render(<PhoneInput excludeCountries={['us']} />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.queryByText('United States')).not.toBeInTheDocument();
    expect(screen.getByText('Japan')).toBeInTheDocument();
  });

  it('strips non-numeric characters from input (strict validation)', () => {
    render(<PhoneInput placeholder="Phone" />);
    const input = screen.getByPlaceholderText('Phone');

    // Type only letters
    fireEvent.change(input, { target: { value: 'abcdef' } });
    expect(input).toHaveValue('');

    // Type a mix of letters and numbers
    fireEvent.change(input, { target: { value: '123abc456' } });
    expect(input).toHaveValue('(123) 456'); // Fallback formats what digits it can
  });

  it('auto-formats the phone number based on the US mask', () => {
    render(<PhoneInput placeholder="Phone" />);
    const input = screen.getByPlaceholderText('Phone');

    fireEvent.change(input, { target: { value: '8005550199' } });
    expect(input).toHaveValue('(800) 555-0199');
  });

  it('re-formats the input when the selected country changes', () => {
    render(<PhoneInput placeholder="Phone" />);
    const input = screen.getByPlaceholderText('Phone');

    // Start with a US number
    fireEvent.change(input, { target: { value: '1234567890' } });
    expect(input).toHaveValue('(123) 456-7890');

    // Open dropdown and switch to United Kingdom (GB)
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const gbOption = screen.getByText('United Kingdom');
    fireEvent.click(gbOption);

    // GB mask is '.... ......', so 1234567890 should format accordingly
    expect(input).toHaveValue('1234 567890');
  });
});
