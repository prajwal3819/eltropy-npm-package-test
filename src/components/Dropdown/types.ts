export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactElement;
}

export interface DropdownStyleOverrides {
  /**
   * Override styles for the root container
   */
  root?: React.CSSProperties;
  /**
   * Override styles for the trigger button
   */
  trigger?: React.CSSProperties;
  /**
   * Override styles for the content/listbox container
   */
  content?: React.CSSProperties;
  /**
   * Override styles for individual items
   */
  item?: React.CSSProperties;
  /**
   * Override styles for the label
   */
  label?: React.CSSProperties;
  /**
   * Override styles for the error message
   */
  error?: React.CSSProperties;
  /**
   * Override styles for the helper text
   */
  helperText?: React.CSSProperties;
}

export interface DropdownBaseProps {
  /**
   * Label text displayed above the dropdown
   */
  label?: string;
  /**
   * Subtext displayed below the label
   */
  labelSubtext?: string;
  /**
   * Placeholder text when no value is selected
   * @default 'Select an option'
   */
  placeholder?: string;
  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;
  /**
   * Whether the field is optional (shows "(optional)" badge)
   * @default false
   */
  optional?: boolean;
  /**
   * Icon displayed on the left side of the trigger
   */
  leftIcon?: React.ReactElement;
  /**
   * Whether to show the left icon
   * @default true
   */
  showLeftIcon?: boolean;
  /**
   * Error message displayed below the dropdown
   */
  error?: string;
  /**
   * Helper text displayed below the dropdown
   */
  helperText?: string;
  /**
   * Maximum width of the dropdown
   * @default '400px'
   */
  maxWidth?: string;
  /**
   * Style overrides for individual parts of the dropdown
   */
  styleOverrides?: DropdownStyleOverrides;
}

export interface DropdownSingleProps extends DropdownBaseProps {
  /**
   * Selection mode
   * @default 'single'
   */
  mode?: 'single';
  /**
   * Available options
   */
  options: DropdownOption[];
  /**
   * Currently selected value
   */
  value?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Whether the dropdown trigger has inline search
   * @default false
   */
  searchable?: boolean;
}

export interface DropdownMultiProps extends DropdownBaseProps {
  /**
   * Selection mode
   */
  mode: 'multi';
  /**
   * Available options
   */
  options: DropdownOption[];
  /**
   * Currently selected values
   */
  value?: string[];
  /**
   * Callback when values change
   */
  onChange?: (value: string[]) => void;
  /**
   * Whether the dropdown has search in the listbox
   * @default true
   */
  searchable?: boolean;
  /**
   * Whether to show a dynamic overflow count badge when selected tags overflow the trigger
   * @default false
   */
  overflowCount?: boolean;
  /**
   * Whether to sort selected options to the top of the list when the dropdown opens
   * @default false
   */
  selectedOnTop?: boolean;
  /**
   * Threshold for enabling list virtualization (number of options)
   * @default 100
   */
  virtualizationThreshold?: number;
}

export interface DropdownAsyncSingleProps extends Omit<
  DropdownSingleProps,
  'options'
> {
  /**
   * Selection mode
   */
  mode?: 'single';
  /**
   * Async function to load options
   */
  loadOptions: (query?: string) => Promise<DropdownOption[]>;
  /**
   * Debounce delay in ms for async search
   * @default 300
   */
  debounceMs?: number;
  /**
   * Whether the dropdown is in a loading state
   */
  loading?: boolean;
}

export interface DropdownAsyncMultiProps extends Omit<
  DropdownMultiProps,
  'options'
> {
  /**
   * Selection mode
   */
  mode: 'multi';
  /**
   * Async function to load options
   */
  loadOptions: (query?: string) => Promise<DropdownOption[]>;
  /**
   * Debounce delay in ms for async search
   * @default 300
   */
  debounceMs?: number;
  /**
   * Whether the dropdown is in a loading state
   */
  loading?: boolean;
}

export type DropdownProps =
  | DropdownSingleProps
  | DropdownMultiProps
  | DropdownAsyncSingleProps
  | DropdownAsyncMultiProps;
