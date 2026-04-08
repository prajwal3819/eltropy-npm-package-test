import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';
import { Box, Stack } from '@chakra-ui/react';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Input/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the search input'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled'
    },
    isInvalid: {
      control: 'boolean',
      description: 'Whether the input is in an error state'
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when isInvalid is true'
    }
  }
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  args: {
    placeholder: 'Search default',
    size: 'md'
  }
};

export const Focused: Story = {
  args: {
    placeholder: 'Search default',
    size: 'md',
    autoFocus: true
  }
};

export const Typing: Story = {
  args: {
    defaultValue: 'Typ',
    size: 'md'
  }
};

export const Filled: Story = {
  args: {
    defaultValue: 'Search Filled',
    size: 'md'
  }
};

export const Error: Story = {
  args: {
    defaultValue: 'Search keyword',
    size: 'md',
    isInvalid: true,
    errorMessage: 'Error message'
  }
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search disabled',
    size: 'md',
    disabled: true
  }
};

export const AllSizes: Story = {
  render: () => (
    <Stack gap="24px" width="280px">
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Small
        </Box>
        <SearchInput size="sm" placeholder="Search small" />
      </Box>
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Medium
        </Box>
        <SearchInput size="md" placeholder="Search medium" />
      </Box>
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Large
        </Box>
        <SearchInput size="lg" placeholder="Search large" />
      </Box>
    </Stack>
  )
};

export const AllStates: Story = {
  render: () => (
    <Stack gap="24px" width="280px">
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Default
        </Box>
        <SearchInput placeholder="Search default" />
      </Box>
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Typing
        </Box>
        <SearchInput defaultValue="Typ" />
      </Box>
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Filled
        </Box>
        <SearchInput defaultValue="Search Filled" />
      </Box>
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Error
        </Box>
        <SearchInput
          defaultValue="Search keyword"
          isInvalid
          errorMessage="Error message"
        />
      </Box>
      <Box>
        <Box fontSize="12px" fontWeight="500" mb="8px" color="navyGray.700">
          Disabled
        </Box>
        <SearchInput placeholder="Search disabled" disabled />
      </Box>
    </Stack>
  )
};
