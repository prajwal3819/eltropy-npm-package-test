import type { Meta, StoryObj } from '@storybook/react';
import { PinInput } from './PinInput';
import { HStack, VStack, Text, Box } from '@chakra-ui/react';

const meta = {
  title: 'Components/Input/PinInput',
  component: PinInput,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    length: {
      control: 'number'
    },
    disabled: {
      control: 'boolean'
    },
    invalid: {
      control: 'boolean'
    },
    error: {
      control: 'text'
    }
  }
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'md',
    length: 6
  }
};

export const States: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Empty
        </Text>
        <PinInput />
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Typing / Filled
        </Text>
        <PinInput value={['5', '5', '5', '5']} />
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Error State
        </Text>
        <PinInput
          value={['5', '2', '1', '4', '5', '5']}
          error="Entered code is wrong"
        />
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Disabled
        </Text>
        <PinInput value={['5', '2', '1', '4', '5', '5']} disabled />
      </Box>
    </VStack>
  )
};

export const Sizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Sizes
        </Text>
        <HStack gap={10} align="flex-start">
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Small
            </Text>
            <PinInput size="sm" value={['1', '2', '3']} length={4} />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Medium
            </Text>
            <PinInput size="md" value={['1', '2', '3']} length={4} />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Large
            </Text>
            <PinInput size="lg" value={['1', '2', '3']} length={4} />
          </Box>
        </HStack>
      </Box>
    </VStack>
  )
};

export const CustomLengths: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Different Lengths
        </Text>
        <VStack align="start" gap={6}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              4 Digits
            </Text>
            <PinInput length={4} />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              6 Digits (Default)
            </Text>
            <PinInput length={6} />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              8 Digits
            </Text>
            <PinInput length={8} />
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
};
