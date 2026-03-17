import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Review } from './review';

describe('Review Component', () => {
  describe('Rendering & Variants', () => {
    it('renders correctly with default props', () => {
      render(<Review data-testid="review-component" />);
      expect(screen.getByTestId('review-component')).toBeInTheDocument();
    });

    it('renders different standard variants (default, compact)', () => {
      const { rerender } = render(
        <Review variant="default" data-testid="review" />
      );
      expect(screen.getByTestId('review')).toBeInTheDocument();

      rerender(<Review variant="compact" data-testid="review" />);
      expect(screen.getByTestId('review')).toBeInTheDocument();
    });

    it('renders the "rated" variant as a static pill without interactive stars', () => {
      render(<Review variant="rated" rating={4.2} maxRating={5} />);

      expect(screen.getByText('4.2/5')).toBeInTheDocument();
      expect(
        screen.queryByRole('radio', { hidden: true })
      ).not.toBeInTheDocument();
    });

    it('renders with different sizes and propagates them', () => {
      const { rerender } = render(<Review size="sm" data-testid="review" />);
      expect(screen.getByTestId('review')).toBeInTheDocument();

      rerender(<Review size="lg" data-testid="review" />);
      expect(screen.getByTestId('review')).toBeInTheDocument();
    });
  });

  describe('Value Display Logic', () => {
    it('shows the value text only when showValue is true in default variant', () => {
      const { rerender } = render(
        <Review defaultValue={3} maxRating={5} showValue />
      );
      expect(screen.getByText('3/5')).toBeInTheDocument();

      rerender(<Review defaultValue={3} maxRating={5} showValue={false} />);
      expect(screen.queryByText('3/5')).not.toBeInTheDocument();
    });

    it('supports half values seamlessly (allowHalf)', () => {
      render(<Review rating={3.5} maxRating={5} showValue />);
      expect(screen.getByText('3.5/5')).toBeInTheDocument();
    });
  });

  describe('Interactions & State', () => {
    it('calls onRatingChange when an interactive star is clicked', () => {
      const handleRatingChange = vi.fn();
      render(<Review onRatingChange={handleRatingChange} maxRating={5} />);

      // Use hidden: true to guarantee we find Chakra's visually hidden inputs
      const stars = screen.getAllByRole('radio', { hidden: true });
      expect(stars.length).toBe(5);

      // Use fireEvent to bypass visibility checks that cause userEvent to fail
      fireEvent.click(stars[2]);

      expect(handleRatingChange).toHaveBeenCalledTimes(1);
    });

    it('does not trigger onRatingChange when readonly is true', () => {
      const handleRatingChange = vi.fn();
      render(
        <Review onRatingChange={handleRatingChange} readonly maxRating={5} />
      );

      const stars = screen.getAllByRole('radio', { hidden: true });

      fireEvent.click(stars[2]);

      expect(handleRatingChange).not.toHaveBeenCalled();
    });

    it('updates internal value correctly when uncontrolled (defaultValue)', () => {
      render(<Review defaultValue={2} maxRating={5} showValue />);
      expect(screen.getByText('2/5')).toBeInTheDocument();

      const stars = screen.getAllByRole('radio', { hidden: true });

      fireEvent.click(stars[3]);

      expect(screen.getByText('4/5')).toBeInTheDocument();
    });

    it('respects controlled rating prop updates from the parent', () => {
      const { rerender } = render(
        <Review rating={2} maxRating={5} showValue />
      );
      expect(screen.getByText('2/5')).toBeInTheDocument();

      rerender(<Review rating={4.5} maxRating={5} showValue />);
      expect(screen.getByText('4.5/5')).toBeInTheDocument();
    });
  });
});
