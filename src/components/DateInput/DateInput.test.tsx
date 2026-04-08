import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DateInput } from './DateInput';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';

vi.mock('../../hooks/useDevice', () => ({
  useDevice: () => ({
    device: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

describe('DateInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with a label', () => {
      render(<DateInput label="Start Date" />);
      expect(screen.getByText('Start Date')).toBeInTheDocument();
    });

    it('renders with label subtext', () => {
      render(<DateInput label="Date" labelSubtext="Select a date" />);
      expect(screen.getByText('Select a date')).toBeInTheDocument();
    });

    it('renders the placeholder text', () => {
      render(<DateInput placeholder="Pick a date" />);
      expect(screen.getByText('Pick a date')).toBeInTheDocument();
    });

    it('renders the default placeholder when none provided', () => {
      render(<DateInput />);
      expect(screen.getByText('mm/dd/yyyy')).toBeInTheDocument();
    });

    it('shows required indicator when required', () => {
      render(<DateInput label="Date" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows optional badge when optional', () => {
      render(<DateInput label="Date" optional />);
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('shows helper text', () => {
      render(<DateInput helperText="Format: mm/dd/yyyy" />);
      expect(screen.getByText('Format: mm/dd/yyyy')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<DateInput error="Invalid date" />);
      expect(screen.getByText('Invalid date')).toBeInTheDocument();
    });

    it('displays a formatted single date value', () => {
      const date = new Date(2025, 0, 15);
      render(<DateInput value={date} mode="single" />);
      expect(screen.getByText('01/15/2025')).toBeInTheDocument();
    });

    it('displays a formatted range value', () => {
      const from = new Date(2025, 0, 10);
      const to = new Date(2025, 0, 20);
      render(<DateInput value={{ from, to }} mode="range" />);
      expect(screen.getByText('01/10/2025 - 01/20/2025')).toBeInTheDocument();
    });

    it('displays multiple dates', () => {
      const dates = [new Date(2025, 0, 10), new Date(2025, 0, 15)];
      render(<DateInput value={dates} mode="multiple" />);
      expect(screen.getByText('01/10/2025, 01/15/2025')).toBeInTheDocument();
    });
  });

  describe('Calendar Interaction', () => {
    it('opens the calendar when the input trigger is clicked', async () => {
      render(<DateInput label="Date" />);
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('grid')).toBeInTheDocument();
      });
    });

    it('closes the calendar on Escape key', async () => {
      render(<DateInput label="Date" />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('grid')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('grid')).not.toBeInTheDocument();
      });
    });

    it('renders the calendar grid with day cells', async () => {
      render(<DateInput mode="single" />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('grid')).toBeInTheDocument();
      });

      const dayButtons = screen.getAllByRole('gridcell');
      expect(dayButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Disabled State', () => {
    it('renders as disabled', () => {
      render(<DateInput disabled label="Date" />);
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not open calendar when disabled', () => {
      render(<DateInput disabled />);
      const trigger = screen.getByRole('button');
      fireEvent.click(trigger);
      expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    });
  });

  describe('Typing Mode', () => {
    it('renders an input field when enableTyping is true', () => {
      render(<DateInput enableTyping label="Date" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('allows typing in the input field', () => {
      render(<DateInput enableTyping label="Date" />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '01/15/2025' } });
      expect(input).toHaveValue('01/15/2025');
    });

    it('sets aria-required on the input when required', () => {
      render(<DateInput enableTyping required label="Date" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-label on the input from the label prop', () => {
      render(<DateInput enableTyping label="Birth Date" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Birth Date');
    });
  });

  describe('Clear Button', () => {
    it('shows clear button when showClearButton is true and value exists', () => {
      const date = new Date(2025, 0, 15);
      render(
        <DateInput
          value={date}
          mode="single"
          showClearButton
          enableTyping
        />,
      );
      expect(screen.getByLabelText('Clear date')).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
      render(<DateInput showClearButton enableTyping />);
      expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
    });

    it('does not show clear button when disabled', () => {
      const date = new Date(2025, 0, 15);
      render(
        <DateInput
          value={date}
          mode="single"
          showClearButton
          enableTyping
          disabled
        />,
      );
      expect(screen.queryByLabelText('Clear date')).not.toBeInTheDocument();
    });
  });

  describe('Footer Actions', () => {
    it('renders Cancel and Save buttons in the calendar footer', async () => {
      render(<DateInput showFooter />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      });
    });

    it('calls onCancel when Cancel is clicked', async () => {
      const onCancel = vi.fn();
      render(<DateInput showFooter onCancel={onCancel} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('calls onSave when Save is clicked', async () => {
      const onSave = vi.fn();
      render(<DateInput showFooter onSave={onSave} />);
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Date Format', () => {
    it('displays date in DD/MM/YYYY format', () => {
      const date = new Date(2025, 0, 15);
      render(
        <DateInput value={date} mode="single" dateFormat="DD/MM/YYYY" />,
      );
      expect(screen.getByText('15/01/2025')).toBeInTheDocument();
    });
  });
});
