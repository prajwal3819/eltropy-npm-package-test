import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import { render, screen, fireEvent } from '../../test/test-utils';

describe('Checkbox', () => {
  it('renders with a label', () => {
    render(<Checkbox>Accept terms</Checkbox>);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders without a label when no children provided', () => {
    const { container } = render(<Checkbox />);
    const label = container.querySelector('label');
    expect(label).toBeInTheDocument();
  });

  it('toggles checked state when clicked', async () => {
  const user = userEvent.setup();
  const handleChange = vi.fn();

  render(
    <Checkbox onCheckedChange={handleChange}>Toggle me</Checkbox>,
  );

  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);

  expect(handleChange).toHaveBeenCalled();
});

  it('renders as checked when checked prop is provided', () => {
    render(<Checkbox checked>Checked</Checkbox>);
    const input = document.querySelector('input[type="checkbox"]');
    expect(input).toBeChecked();
  });

  it('renders as unchecked by default', () => {
    render(<Checkbox>Unchecked</Checkbox>);
    const input = document.querySelector('input[type="checkbox"]');
    expect(input).not.toBeChecked();
  });

  it('renders as disabled and prevents interaction', () => {
    const handleChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={handleChange}>
        Disabled
      </Checkbox>,
    );

    const input = document.querySelector('input[type="checkbox"]')!;
    expect(input).toBeDisabled();

    fireEvent.click(input);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('supports different sizes', () => {
    const { rerender } = render(<Checkbox size="sm">Small</Checkbox>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Checkbox size="md">Medium</Checkbox>);
    expect(screen.getByText('Medium')).toBeInTheDocument();

    rerender(<Checkbox size="lg">Large</Checkbox>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = vi.fn();
    render(<Checkbox ref={ref}>With ref</Checkbox>);
    expect(ref).toHaveBeenCalled();
  });

  it('renders in indeterminate state when checked is "indeterminate"', () => {
    const { container } = render(
      <Checkbox checked="indeterminate">Partial</Checkbox>,
    );
    const root = container.querySelector('[data-state="indeterminate"]');
    expect(root).toBeInTheDocument();
    expect(screen.getByText('Partial')).toBeInTheDocument();
  });

  it('contains a hidden native input for form submission', () => {
    render(<Checkbox name="terms" value="accepted">Terms</Checkbox>);
    const input = document.querySelector('input[type="checkbox"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'terms');
    expect(input).toHaveAttribute('value', 'accepted');
  });
});
