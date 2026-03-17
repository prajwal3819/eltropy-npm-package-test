import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dropdown } from './Dropdown';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import type { DropdownOption } from './types';

vi.mock('../../hooks/useDevice', () => ({
  useDevice: () => ({
    device: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  }),
}));

const options: DropdownOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

describe('Dropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with a label', () => {
      render(<Dropdown label="Fruit" options={options} />);
      expect(screen.getByText('Fruit')).toBeInTheDocument();
    });

    it('renders with label subtext', () => {
      render(
        <Dropdown
          label="Fruit"
          labelSubtext="Pick your favorite"
          options={options}
        />,
      );
      expect(screen.getByText('Pick your favorite')).toBeInTheDocument();
    });

    it('renders the placeholder text', () => {
      render(<Dropdown placeholder="Choose fruit" options={options} />);
      expect(screen.getByText('Choose fruit')).toBeInTheDocument();
    });

    it('renders the default placeholder when none provided', () => {
      render(<Dropdown options={options} />);
      expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('shows required indicator', () => {
      render(<Dropdown label="Fruit" required options={options} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('shows optional badge', () => {
      render(<Dropdown label="Fruit" optional options={options} />);
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('shows error message', () => {
      render(<Dropdown error="Selection required" options={options} />);
      expect(screen.getByText('Selection required')).toBeInTheDocument();
    });

    it('shows helper text when no error', () => {
      render(<Dropdown helperText="Pick one" options={options} />);
      expect(screen.getByText('Pick one')).toBeInTheDocument();
    });

    it('hides helper text when error is present', () => {
      render(
        <Dropdown
          helperText="Pick one"
          error="Required"
          options={options}
        />,
      );
      expect(screen.queryByText('Pick one')).not.toBeInTheDocument();
      expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('displays the selected option label in single mode', () => {
      render(<Dropdown options={options} value="banana" />);
      expect(screen.getByText('Banana')).toBeInTheDocument();
    });
  });

  describe('Trigger Accessibility', () => {
    it('has aria-haspopup="listbox"', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    it('has aria-expanded=false when closed', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded=true when open', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-disabled when disabled', () => {
      render(<Dropdown options={options} disabled />);
      const trigger = screen.getByRole('button');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('Single Select Interaction', () => {
    it('opens the listbox when trigger is clicked', () => {
      render(<Dropdown options={options} />);
      fireEvent.click(screen.getByRole('button', { name: /select an option/i }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('displays all options in the listbox', () => {
      render(<Dropdown options={options} />);
      fireEvent.click(screen.getByRole('button', { name: /select an option/i }));
      const listboxOptions = screen.getAllByRole('option');
      expect(listboxOptions).toHaveLength(3);
    });

    it('calls onChange and closes when an option is selected', () => {
      const onChange = vi.fn();
      render(<Dropdown options={options} onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: /select an option/i }));
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }));

      expect(onChange).toHaveBeenCalledWith('apple');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('marks the selected option with aria-selected', () => {
      render(<Dropdown options={options} value="banana" />);
      fireEvent.click(screen.getByRole('button'));

      const bananaOption = screen.getByRole('option', { name: 'Banana' });
      expect(bananaOption).toHaveAttribute('aria-selected', 'true');

      const appleOption = screen.getByRole('option', { name: 'Apple' });
      expect(appleOption).toHaveAttribute('aria-selected', 'false');
    });

    it('does not open when disabled', () => {
      render(<Dropdown options={options} disabled />);
      fireEvent.click(screen.getByRole('button'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Multi Select Interaction', () => {
    it('renders selected tags in the trigger', () => {
      render(
        <Dropdown
          mode="multi"
          options={options}
          value={['apple', 'cherry']}
        />,
      );
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Cherry')).toBeInTheDocument();
    });

    it('shows placeholder when no values selected in multi mode', () => {
      render(
        <Dropdown
          mode="multi"
          options={options}
          placeholder="Select fruits"
        />,
      );
      expect(screen.getByText('Select fruits')).toBeInTheDocument();
    });

    it('calls onChange with toggled values when an option is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Dropdown
          mode="multi"
          options={options}
          value={['apple']}
          onChange={onChange}
        />,
      );

      const trigger = container.querySelector('button[aria-haspopup="listbox"]')!;
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('option', { name: 'Banana' }));

      expect(onChange).toHaveBeenCalledWith(['apple', 'banana']);
    });

    it('removes a value when an already-selected option is clicked', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Dropdown
          mode="multi"
          options={options}
          value={['apple', 'banana']}
          onChange={onChange}
        />,
      );

      const trigger = container.querySelector('button[aria-haspopup="listbox"]')!;
      fireEvent.click(trigger);
      fireEvent.click(screen.getByRole('option', { name: 'Apple' }));

      expect(onChange).toHaveBeenCalledWith(['banana']);
    });

    it('selects all options via Select All checkbox', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Dropdown
          mode="multi"
          options={options}
          value={['apple']}
          onChange={onChange}
          searchable
        />,
      );

      const trigger = container.querySelector('button[aria-haspopup="listbox"]')!;
      fireEvent.click(trigger);

      const selectAll = screen.getByText('Select all');
      fireEvent.click(selectAll.closest('[role="option"]')!);

      expect(onChange).toHaveBeenCalledWith(['apple', 'banana', 'cherry']);
    });

    it('deselects all options via Select All when all are selected', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Dropdown
          mode="multi"
          options={options}
          value={['apple', 'banana', 'cherry']}
          onChange={onChange}
          searchable
        />,
      );

      const trigger = container.querySelector('button[aria-haspopup="listbox"]')!;
      fireEvent.click(trigger);

      const selectAll = screen.getByText('Select all');
      fireEvent.click(selectAll.closest('[role="option"]')!);

      expect(onChange).toHaveBeenCalledWith([]);
    });

    it('sets aria-multiselectable on the listbox', () => {
      render(
        <Dropdown mode="multi" options={options} value={[]} />,
      );
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByRole('listbox')).toHaveAttribute(
        'aria-multiselectable',
        'true',
      );
    });
  });

  describe('Keyboard Navigation', () => {
    it('opens the listbox with Enter key', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens the listbox with Space key', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.keyDown(trigger, { key: ' ' });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('opens the listbox with ArrowDown key', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('closes the listbox with Escape key', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(trigger, { key: 'Escape' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('closes the listbox with Tab key', () => {
      render(<Dropdown options={options} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.keyDown(trigger, { key: 'Tab' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('navigates options with ArrowDown and selects with Enter', () => {
      const onChange = vi.fn();
      render(<Dropdown options={options} onChange={onChange} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });

      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('wraps focus from last to first option with ArrowDown', () => {
      const onChange = vi.fn();
      render(<Dropdown options={options} onChange={onChange} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });

      // First ArrowDown opens the listbox (focusedIndex stays -1)
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      // ArrowDown -> index 0 (Apple)
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      // ArrowDown -> index 1 (Banana)
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      // ArrowDown -> index 2 (Cherry)
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      // ArrowDown -> wraps to index 0 (Apple)
      fireEvent.keyDown(trigger, { key: 'ArrowDown' });
      fireEvent.keyDown(trigger, { key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith('apple');
    });

    it('does not respond to keyboard when disabled', () => {
      render(<Dropdown options={options} disabled />);
      const trigger = screen.getByRole('button');
      fireEvent.keyDown(trigger, { key: 'Enter' });
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Search / Filter', () => {
    it('filters options based on search query in single searchable mode', async () => {
      render(<Dropdown options={options} searchable />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);

      const searchInput = screen.getByPlaceholderText('Select an option');
      fireEvent.change(searchInput, { target: { value: 'ban' } });

      await waitFor(() => {
        const visibleOptions = screen.getAllByRole('option');
        expect(visibleOptions).toHaveLength(1);
        expect(screen.getByText('Banana')).toBeInTheDocument();
      });
    });

    it('shows "No options found" when search yields no results', async () => {
      render(<Dropdown options={options} searchable />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);

      const searchInput = screen.getByPlaceholderText('Select an option');
      fireEvent.change(searchInput, { target: { value: 'xyz' } });

      await waitFor(() => {
        expect(screen.getByText('No options found')).toBeInTheDocument();
      });
    });

    it('filters options in multi searchable mode', async () => {
      render(
        <Dropdown
          mode="multi"
          options={options}
          value={[]}
          searchable
        />,
      );
      fireEvent.click(screen.getByRole('button'));

      const searchInput = screen.getByPlaceholderText('Search');
      fireEvent.change(searchInput, { target: { value: 'cher' } });

      await waitFor(() => {
        const visibleOptions = screen.getAllByRole('option');
        expect(visibleOptions).toHaveLength(2);
        expect(screen.getByText('Select all')).toBeInTheDocument();
        expect(screen.getByText('Cherry')).toBeInTheDocument();
      });
    });
  });

  describe('Async Loading', () => {
    it('displays "Loading..." while options are being fetched', async () => {
      const loadOptions = vi.fn(
        () => new Promise<DropdownOption[]>(() => {}),
      );

      render(<Dropdown loadOptions={loadOptions} debounceMs={0} />);
      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });

    it('displays fetched options after loading completes', async () => {
      const loadOptions = vi.fn(() => Promise.resolve(options));

      render(<Dropdown loadOptions={loadOptions} debounceMs={0} />);

      await waitFor(() => {
        expect(loadOptions).toHaveBeenCalled();
      });

      const trigger = screen.getByRole('button', { name: /select an option/i });
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getAllByRole('option')).toHaveLength(3);
      });
    });
  });

  describe('Close Behavior', () => {
    it('closes when clicking outside the dropdown', () => {
      render(<Dropdown options={options} />);
      fireEvent.click(screen.getByRole('button', { name: /select an option/i }));
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const overlay = screen.getByRole('listbox').previousElementSibling;
      if (overlay) {
        fireEvent.click(overlay);
      }

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
