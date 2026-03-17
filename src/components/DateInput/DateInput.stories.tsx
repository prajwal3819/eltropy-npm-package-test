import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, VStack, Text, HStack } from '@chakra-ui/react';
import { DateInput } from './DateInput';

const meta = {
  title: 'Components/DateInput',
  component: DateInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range', 'multiple'],
      description: 'Selection mode for the date picker',
    },
    numberOfMonths: {
      control: 'select',
      options: [1, 2],
      description: 'Number of months to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    optional: {
      control: 'boolean',
      description: 'Whether to show optional text',
    },
    showFooter: {
      control: 'boolean',
      description: 'Whether to show Cancel/Save footer',
    },
  },
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Select Date',
    labelSubtext: 'Choose a date',
    required: true,
  },
};

const SingleSelectRender = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <DateInput
      label="Select Date"
      labelSubtext="Choose a single date"
      mode="single"
      value={date}
      optional={true}
      onChange={(val) => setDate(val as Date)}
    />
  );
};

export const SingleSelect: Story = {
  render: () => <SingleSelectRender />,
};

const DateRangeSelectRender = () => {
  const [range, setRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();
  return (
    <DateInput
      label="Date Range"
      labelSubtext="Select start and end dates"
      mode="range"
      value={range}
      onChange={(val) => setRange(val as { from?: Date; to?: Date })}
      required
    />
  );
};

export const DateRangeSelect: Story = {
  render: () => <DateRangeSelectRender />,
};

const TwoMonthsViewRender = () => {
  const [range, setRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();
  return (
    <DateInput
      label="Date Range"
      labelSubtext="Two months view"
      mode="range"
      numberOfMonths={2}
      value={range}
      inputStyles={{width:'580px'}}
      onChange={(val) => setRange(val as { from?: Date; to?: Date })}
      required
    />
  );
};

export const TwoMonthsView: Story = {
  render: () => <TwoMonthsViewRender />,
};

const MultipleSelectRender = () => {
  const [dates, setDates] = useState<Date[] | undefined>();
  return (
    <DateInput
      label="Multiple Dates"
      labelSubtext="Select multiple dates"
      mode="multiple"
      value={dates}
      onChange={(val) => setDates(val as Date[])}
      required
    />
  );
};

export const MultipleSelect: Story = {
  render: () => <MultipleSelectRender />,
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    labelSubtext: 'This input is disabled',
    disabled: true,
    required: true,
    value: new Date(2000, 11, 9),
  },
};

export const WithError: Story = {
  args: {
    label: 'Date Input',
    labelSubtext: 'With error message',
    error: 'Please select a valid date',
    required: true,
    value: new Date(2000, 11, 9),
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Date Input',
    labelSubtext: 'With helper text',
    helperText: 'Select a date within the current month',
    required: true,
  },
};

const WithMinMaxDatesRender = () => {
  const [date, setDate] = useState<Date | undefined>();
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <DateInput
      label="Date with constraints"
      labelSubtext="Only current month selectable"
      mode="single"
      value={date}
      onChange={(val) => setDate(val as Date)}
      minDate={minDate}
      maxDate={maxDate}
      required
    />
  );
};

export const WithMinMaxDates: Story = {
  render: () => <WithMinMaxDatesRender />,
};

const WithDisabledDatesRender = () => {
  const [date, setDate] = useState<Date | undefined>();
  const today = new Date();
  const disabledDates = [
    new Date(today.getFullYear(), today.getMonth(), 5),
    new Date(today.getFullYear(), today.getMonth(), 10),
    new Date(today.getFullYear(), today.getMonth(), 15),
    new Date(today.getFullYear(), today.getMonth(), 20),
  ];

  return (
    <DateInput
      label="Date with disabled dates"
      labelSubtext="Some dates are disabled"
      mode="single"
      value={date}
      onChange={(val) => setDate(val as Date)}
      disabledDates={disabledDates}
      required
    />
  );
};

export const WithDisabledDates: Story = {
  render: () => <WithDisabledDatesRender />,
};

const WithoutFooterRender = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <DateInput
      label="Quick Select"
      labelSubtext="No footer buttons"
      mode="single"
      value={date}
      onChange={(val) => setDate(val as Date)}
      showFooter={false}
    />
  );
};

export const WithoutFooter: Story = {
  render: () => <WithoutFooterRender />,
};

const MobileResponsiveRender = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Mobile Responsive Demo
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          Resize your browser window to see mobile (bottom sheet) vs desktop
          (dropdown) behavior. Mobile breakpoint: 768px
        </Text>
        <DateInput
          label="Select Date"
          labelSubtext="Automatically adapts to screen size"
          mode="single"
          value={date}
          onChange={(val) => setDate(val as Date)}
          required
        />
      </Box>

      <Box>
        <Text fontSize="sm" color="gray.600" mb={2}>
          <strong>Mobile View (&lt; 768px):</strong>
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Calendar opens in bottom sheet
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Swipeable handle at top
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Cancel and Done buttons
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Backdrop overlay
        </Text>
        <Text fontSize="sm" color="gray.600" mb={4}>
          • Smooth slide-up animation
        </Text>

        <Text fontSize="sm" color="gray.600" mb={2}>
          <strong>Desktop View (&gt;= 768px):</strong>
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Calendar opens as dropdown
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Positioned below input
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Click outside to close
        </Text>
      </Box>
    </VStack>
  );
};

export const MobileResponsive: Story = {
  render: () => <MobileResponsiveRender />,
};

const WithTypingEnabledRender = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <VStack align="stretch" gap={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Typing Features Demo
        </Text>
        <DateInput
          label="Type or Select Date"
          labelSubtext="Auto-formats as you type with '/' separators"
          mode="single"
          value={date}
          onChange={(val) => setDate(val as Date)}
          enableTyping
          required
          helperText="Try typing: 12252024 (auto-formats to 12/25/2024)"
        />
      </Box>

      <Box>
        <Text fontSize="sm" color="gray.600" mb={2}>
          <strong>Features:</strong>
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Auto-inserts '/' separators as you type
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Shows dynamic placeholder for remaining format (e.g., "12/0" →
          shows "d/yyyy")
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Validates date format and shows errors
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Only allows numbers and separators (no letters)
        </Text>
        <Text fontSize="sm" color="gray.600" mb={1}>
          • Press Enter to confirm, or click calendar icon to select
        </Text>
        <Text fontSize="sm" color="gray.600">
          • Calendar updates in real-time as you type valid dates
        </Text>
      </Box>
    </VStack>
  );
};

export const WithTypingEnabled: Story = {
  render: () => <WithTypingEnabledRender />,
};

export const AllStates: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Text fontSize="2xl" fontWeight="bold">
        DateInput States
      </Text>

      <HStack gap={8} align="start" wrap="wrap">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Default
          </Text>
          <DateInput
            label="Select Date"
            labelSubtext="Choose a date"
            required
          />
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Filled
          </Text>
          <DateInput
            label="Select Date"
            labelSubtext="Date selected"
            value={new Date(2000, 11, 9)}
            required
          />
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Disabled
          </Text>
          <DateInput
            label="Select Date"
            labelSubtext="Cannot select"
            value={new Date(2000, 11, 9)}
            disabled
            required
          />
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Error
          </Text>
          <DateInput
            label="Select Date"
            labelSubtext="Invalid date"
            value={new Date(2000, 11, 9)}
            error="Please select a valid date"
            required
          />
        </Box>
      </HStack>
    </VStack>
  ),
};

const MobileRangeSelectionRender = () => {
  const [range, setRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Mobile Range Selection
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Test range selection on mobile with bottom sheet
      </Text>
      <DateInput
        label="Date Range"
        labelSubtext="Select start and end dates"
        mode="range"
        value={range}
        onChange={(val) => setRange(val as { from?: Date; to?: Date })}
        required
      />
    </Box>
  );
};

export const MobileRangeSelection: Story = {
  render: () => <MobileRangeSelectionRender />,
};

const SingleDemo = () => {
  const [date, setDate] = useState<Date | undefined>();
  return (
    <DateInput
      label="Single Select"
      labelSubtext="Choose one date"
      mode="single"
      value={date}
      onChange={(val) => setDate(val as Date)}
      required
    />
  );
};

const RangeDemo = () => {
  const [range, setRange] = useState<
    { from?: Date; to?: Date } | undefined
  >();
  return (
    <DateInput
      label="Range Select"
      labelSubtext="Choose date range"
      mode="range"
      value={range}
      onChange={(val) => setRange(val as { from?: Date; to?: Date })}
      required
    />
  );
};

const MultipleDemo = () => {
  const [dates, setDates] = useState<Date[] | undefined>();
  return (
    <DateInput
      label="Multiple Select"
      labelSubtext="Choose multiple dates"
      mode="multiple"
      value={dates}
      onChange={(val) => setDates(val as Date[])}
      required
    />
  );
};

export const AllModes: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Text fontSize="2xl" fontWeight="bold">
        DateInput Modes
      </Text>

      <HStack gap={8} align="start" wrap="wrap">
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Single
          </Text>
          <SingleDemo />
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Range
          </Text>
          <RangeDemo />
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Multiple
          </Text>
          <MultipleDemo />
        </Box>
      </HStack>
    </VStack>
  ),
};
