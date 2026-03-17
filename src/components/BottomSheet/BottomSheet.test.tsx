import { describe, it, expect, vi } from 'vitest';
import { BottomSheet } from './BottomSheet';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  children: <p>Sheet content</p>,
};

describe('BottomSheet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    render(
      <BottomSheet {...defaultProps} isOpen={false}>
        <p>Hidden content</p>
      </BottomSheet>,
    );
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('renders children when open', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(screen.getByText('Sheet content')).toBeInTheDocument();
  });

  it('renders as a dialog with correct ARIA attributes', () => {
    render(<BottomSheet {...defaultProps} title="My Sheet" />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'bottom-sheet-title');
  });

  it('renders the title when provided', () => {
    render(<BottomSheet {...defaultProps} title="Filter Options" />);
    expect(screen.getByText('Filter Options')).toBeInTheDocument();
  });

  it('does not render aria-labelledby when no title is provided', () => {
    render(<BottomSheet {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('renders Cancel and Done buttons by default', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('hides Cancel button when showCancelButton is false', () => {
    render(<BottomSheet {...defaultProps} showCancelButton={false} />);
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('hides Confirm button when showConfirmButton is false', () => {
    render(<BottomSheet {...defaultProps} showConfirmButton={false} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /done/i })).not.toBeInTheDocument();
  });

  it('uses custom button labels', () => {
    render(
      <BottomSheet
        {...defaultProps}
        cancelLabel="Dismiss"
        confirmLabel="Apply"
      />,
    );
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<BottomSheet {...defaultProps} onClose={onClose} />);

    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement!;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside the sheet content', () => {
    const onClose = vi.fn();
    render(<BottomSheet {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText('Sheet content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onCancel and onClose when Cancel is clicked', () => {
    const onClose = vi.fn();
    const onCancel = vi.fn();
    render(
      <BottomSheet {...defaultProps} onClose={onClose} onCancel={onCancel} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm and onClose when Done is clicked', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <BottomSheet {...defaultProps} onClose={onClose} onConfirm={onConfirm} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /done/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when open', () => {
    render(<BottomSheet {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', async () => {
    const { rerender } = render(<BottomSheet {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<BottomSheet {...defaultProps} isOpen={false} />);
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });
  });

  it('hides both buttons when both show props are false', () => {
    render(
      <BottomSheet
        {...defaultProps}
        showCancelButton={false}
        showConfirmButton={false}
      />,
    );
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /done/i })).not.toBeInTheDocument();
  });
});
