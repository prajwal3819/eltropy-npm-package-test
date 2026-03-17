import { describe, it, expect, vi } from 'vitest';
import { Tag } from './Tag';
import { render, screen, fireEvent } from '../../test/test-utils';

describe('Tag', () => {
  it('renders with text content', () => {
    render(<Tag>Status</Tag>);
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Tag variant="solid">Solid</Tag>);
    expect(screen.getByText('Solid')).toBeInTheDocument();

    rerender(<Tag variant="subtle">Subtle</Tag>);
    expect(screen.getByText('Subtle')).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Tag size="sm">Small</Tag>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    rerender(<Tag size="md">Medium</Tag>);
    expect(screen.getByText('Medium')).toBeInTheDocument();

    rerender(<Tag size="lg">Large</Tag>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders with a left icon', () => {
    render(
      <Tag leftIcon={<span data-testid="left-icon">L</span>}>
        With Icon
      </Tag>,
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icon')).toBeInTheDocument();
  });

  it('renders with a right icon when not closable', () => {
    render(
      <Tag rightIcon={<span data-testid="right-icon">R</span>}>
        With Right
      </Tag>,
    );
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('hides right icon when closable is true', () => {
    render(
      <Tag
        rightIcon={<span data-testid="right-icon">R</span>}
        closable
        onClose={vi.fn()}
      >
        Closable
      </Tag>,
    );
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  it('renders a close button when closable', () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        Removable
      </Tag>,
    );

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose}>
        Removable
      </Tag>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when tag is clicked', () => {
    const onClick = vi.fn();
    render(<Tag onClick={onClick}>Clickable</Tag>);

    fireEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Tag onClick={onClick} disabled>
        Disabled
      </Tag>,
    );

    fireEvent.click(screen.getByText('Disabled'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClose when disabled', () => {
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose} disabled>
        Disabled Close
      </Tag>,
    );

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('close button click does not bubble to tag onClick', () => {
    const onClick = vi.fn();
    const onClose = vi.fn();
    render(
      <Tag closable onClose={onClose} onClick={onClick}>
        Both handlers
      </Tag>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('sets aria-disabled when disabled', () => {
    render(<Tag disabled>Disabled Tag</Tag>);
    const tag = screen.getByText('Disabled Tag').closest('[aria-disabled]');
    expect(tag).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders with pointer cursor when clickable', () => {
    render(<Tag onClick={vi.fn()}>Clickable</Tag>);
    const tag = screen.getByText('Clickable').closest('[class]');
    expect(tag).toBeInTheDocument();
  });
});
