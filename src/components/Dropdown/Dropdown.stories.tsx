import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown } from './Dropdown';
import { type DropdownOption } from './types';
import { UserIcon, DashboardIcon } from '../../assets/icons';

const sampleOptions: DropdownOption[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
];

const timezoneOptions: DropdownOption[] = [
  {
    label: 'Georgetown, Manaus, San Juan',
    value: 'utc-4-georgetown',
    icon: <UserIcon />,
  },
  {
    label: 'Atlantic Time (Canada)',
    value: 'utc-4-atlantic',
    icon: <UserIcon />,
  },
  {
    label: 'Eastern Time (US and Canada)',
    value: 'utc-5-eastern',
    icon: <UserIcon />,
  },
  { label: 'Indiana (East)', value: 'utc-5-indiana', icon: <UserIcon /> },
  {
    label: 'Central Time (US and Canada)',
    value: 'utc-6-central',
    icon: <UserIcon />,
  },
  {
    label: 'Guadalajara, Mexico City',
    value: 'utc-6-mexico',
    icon: <UserIcon />,
  },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const SingleSelectRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Select an option"
      options={sampleOptions}
      value={value}
      onChange={setValue}
      placeholder="Choose one"
    />
  );
};

export const SingleSelect: Story = {
  render: () => <SingleSelectRender />,
};

const SingleSelectWithSelectionRender = () => {
  const [value, setValue] = useState('utc-5-eastern');
  return (
    <Dropdown
      mode="single"
      label="Label"
      labelSubtext="Label Subtext"
      required
      optional
      options={timezoneOptions}
      value={value}
      onChange={setValue}
      placeholder="Select timezone"
      leftIcon={<DashboardIcon />}
    />
  );
};

export const SingleSelectWithSelection: Story = {
  render: () => <SingleSelectWithSelectionRender />,
};

const SingleSearchableRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Timezone"
      labelSubtext="Search and select your timezone"
      options={timezoneOptions}
      value={value}
      onChange={setValue}
      placeholder="Select timezone"
      leftIcon={<DashboardIcon />}
      searchable
    />
  );
};

export const SingleSearchable: Story = {
  render: () => <SingleSearchableRender />,
};

const MultiSelectRender = () => {
  const [values, setValues] = useState<string[]>([]);
  return (
    <Dropdown
      mode="multi"
      label="Label"
      labelSubtext="Label Subtext"
      required
      optional
      options={timezoneOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      leftIcon={<DashboardIcon />}
      searchable
    />
  );
};

export const MultiSelect: Story = {
  render: () => <MultiSelectRender />,
};

const MultiSelectWithOverflowRender = () => {
  const [values, setValues] = useState<string[]>([
    'utc-4-georgetown',
    'utc-4-atlantic',
    'utc-5-eastern',
    'utc-6-central',
    'utc-6-mexico',
  ]);
  return (
    <Dropdown
      mode="multi"
      label="Label"
      labelSubtext="Label Subtext"
      required
      optional
      options={timezoneOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      leftIcon={<DashboardIcon />}
      searchable
      overflowCount
    />
  );
};

export const MultiSelectWithOverflow: Story = {
  render: () => <MultiSelectWithOverflowRender />,
};

const MultiSelectDynamicOverflowRender = () => {
  const [values, setValues] = useState<string[]>([
    'utc-5-eastern',
    'utc-6-central',
    'utc-6-mexico',
    'utc-4-atlantic',
  ]);
  return (
    <Dropdown
      mode="multi"
      label="Dynamic overflow count"
      options={timezoneOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      leftIcon={<DashboardIcon />}
      searchable
      overflowCount
    />
  );
};

export const MultiSelectDynamicOverflow: Story = {
  render: () => <MultiSelectDynamicOverflowRender />,
};

const AsyncSingleRender = () => {
  const [value, setValue] = useState('');
  const loadOptions = async (): Promise<DropdownOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return sampleOptions;
  };
  return (
    <Dropdown
      mode="single"
      label="Async dropdown"
      loadOptions={loadOptions}
      value={value}
      onChange={setValue}
      placeholder="Loading options..."
    />
  );
};

export const AsyncSingle: Story = {
  render: () => <AsyncSingleRender />,
};

const AsyncMultiRender = () => {
  const [values, setValues] = useState<string[]>([]);
  const loadOptions = async (): Promise<DropdownOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return timezoneOptions;
  };
  return (
    <Dropdown
      mode="multi"
      label="Async multi-select"
      loadOptions={loadOptions}
      value={values}
      onChange={setValues}
      placeholder="Loading options..."
      searchable
    />
  );
};

export const AsyncMulti: Story = {
  render: () => <AsyncMultiRender />,
};

const WithErrorRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Label"
      labelSubtext="Label Subtext"
      required
      optional
      options={sampleOptions}
      value={value}
      onChange={setValue}
      placeholder="Filled"
      leftIcon={<DashboardIcon />}
      error="Error message"
    />
  );
};

export const WithError: Story = {
  render: () => <WithErrorRender />,
};

const WithHelperTextRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Select an option"
      options={sampleOptions}
      value={value}
      onChange={setValue}
      helperText="Choose the best option for you"
    />
  );
};

export const WithHelperText: Story = {
  render: () => <WithHelperTextRender />,
};

export const Disabled: Story = {
  render: () => {
    return (
      <Dropdown
        mode="single"
        label="Disabled dropdown"
        options={sampleOptions}
        value="1"
        disabled
      />
    );
  },
};

const WithLeftIconRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Timezone"
      options={timezoneOptions}
      value={value}
      onChange={setValue}
      placeholder="Select timezone"
      leftIcon={<DashboardIcon />}
    />
  );
};

export const WithLeftIcon: Story = {
  render: () => <WithLeftIconRender />,
};

const WithoutLeftIconRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="No icon"
      options={sampleOptions}
      value={value}
      onChange={setValue}
      placeholder="Select option"
      leftIcon={<DashboardIcon />}
      showLeftIcon={false}
    />
  );
};

export const WithoutLeftIcon: Story = {
  render: () => <WithoutLeftIconRender />,
};

const CustomMaxWidthRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Custom width (600px)"
      options={timezoneOptions}
      value={value}
      onChange={setValue}
      placeholder="Select timezone"
      leftIcon={<DashboardIcon />}
      maxWidth="600px"
    />
  );
};

export const CustomMaxWidth: Story = {
  render: () => <CustomMaxWidthRender />,
};

const MobileSingleSelectRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Mobile Single Select"
      labelSubtext="Auto-detected on viewport < 480px"
      options={timezoneOptions}
      value={value}
      onChange={setValue}
      placeholder="Select timezone"
      leftIcon={<DashboardIcon />}
      searchable
    />
  );
};

export const MobileSingleSelect: Story = {
  render: () => <MobileSingleSelectRender />,
};

const MobileMultiSelectRender = () => {
  const [values, setValues] = useState<string[]>([]);
  return (
    <Dropdown
      mode="multi"
      label="Mobile Multi Select"
      labelSubtext="Auto-detected on viewport < 480px"
      options={timezoneOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      leftIcon={<DashboardIcon />}
      searchable
    />
  );
};

export const MobileMultiSelect: Story = {
  render: () => <MobileMultiSelectRender />,
};

const WithStyleOverridesRender = () => {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      mode="single"
      label="Custom styles"
      options={sampleOptions}
      value={value}
      onChange={setValue}
      placeholder="Choose one"
      styleOverrides={{
        trigger: { borderRadius: '8px' },
      }}
    />
  );
};

export const WithStyleOverrides: Story = {
  render: () => <WithStyleOverridesRender />,
};

const MultiSelectWithSelectAllRender = () => {
  const [values, setValues] = useState<string[]>(['utc-5-eastern']);
  return (
    <Dropdown
      mode="multi"
      label="Multi Select with Select All"
      labelSubtext="Select All checkbox replaces selected tags"
      options={timezoneOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      leftIcon={<DashboardIcon />}
      searchable
    />
  );
};

export const MultiSelectWithSelectAll: Story = {
  render: () => <MultiSelectWithSelectAllRender />,
};

const MultiSelectSelectedOnTopRender = () => {
  const [values, setValues] = useState<string[]>([
    'utc-5-eastern',
    'utc-6-mexico',
  ]);
  return (
    <Dropdown
      mode="multi"
      label="Selected on Top"
      labelSubtext="Selected items sort to top when dropdown opens"
      options={timezoneOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      leftIcon={<DashboardIcon />}
      searchable
      selectedOnTop
    />
  );
};

export const MultiSelectSelectedOnTop: Story = {
  render: () => <MultiSelectSelectedOnTopRender />,
};

const generateLargeOptions = (count: number): DropdownOption[] =>
  Array.from({ length: count }, (_, i) => ({
    label: `Option ${i + 1} — ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'][i % 5]} Group`,
    value: `option-${i + 1}`,
  }));

const LargeListVirtualizedRender = () => {
  const [values, setValues] = useState<string[]>(['option-1', 'option-50', 'option-100']);
  const largeOptions = generateLargeOptions(500);
  return (
    <Dropdown
      mode="multi"
      label="Large List (500 items, virtualized)"
      labelSubtext="Virtualization kicks in at 100+ items"
      options={largeOptions}
      value={values}
      onChange={setValues}
      placeholder="Select options"
      searchable
      selectedOnTop
    />
  );
};

export const LargeListVirtualized: Story = {
  render: () => <LargeListVirtualizedRender />,
};
