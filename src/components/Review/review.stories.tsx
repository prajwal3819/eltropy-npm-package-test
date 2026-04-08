import type { Meta, StoryObj } from '@storybook/react';
import { Review } from './review';
import { HStack, VStack, Text, Box } from '@chakra-ui/react';

const meta = {
  title: 'Components/Review',
  component: Review,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'rated'] // Added 'rated'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    rating: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      description: 'Controlled rating value'
    },
    defaultValue: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      description: 'Initial uncontrolled rating value'
    },
    maxRating: {
      control: { type: 'number', min: 1, max: 10 }
    },
    showValue: {
      control: 'boolean'
    },
    readonly: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof Review>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 3.5,
    showValue: true,
    size: 'md',
    variant: 'default'
  }
};

export const RatedVariant: Story = {
  args: {
    rating: 4.8,
    maxRating: 5,
    size: 'md',
    variant: 'rated'
  }
};

export const AllSizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Review Sizes
        </Text>
        <VStack align="start" gap={4}>
          <HStack w="150px" justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Small (sm)
            </Text>
            <Review size="sm" defaultValue={3.5} showValue readonly />
          </HStack>
          <HStack w="150px" justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Medium (md)
            </Text>
            <Review size="md" defaultValue={3.5} showValue readonly />
          </HStack>
          <HStack w="150px" justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Large (lg)
            </Text>
            <Review size="lg" defaultValue={3.5} showValue readonly />
          </HStack>
        </VStack>
      </Box>
    </VStack>
  )
};

export const AllVariants: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Review Variants
        </Text>
        <VStack align="start" gap={6}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Default Variant
            </Text>
            <Review variant="default" defaultValue={4} showValue readonly />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Compact Variant
            </Text>
            <Review variant="compact" defaultValue={4} showValue readonly />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Rated Variant (Static Pill)
            </Text>
            <Review variant="rated" rating={4.2} maxRating={5} />
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
};

export const InteractiveVsReadonly: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Interaction States
        </Text>
        <VStack align="start" gap={6}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Interactive (Click to rate)
            </Text>
            <Review defaultValue={0} showValue readonly={false} />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Readonly (Static display)
            </Text>
            <Review rating={4.5} showValue readonly={true} />
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
};

export const CustomConfigurations: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Custom Configurations
        </Text>
        <VStack align="start" gap={6}>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Out of 10 Stars
            </Text>
            <Review maxRating={10} defaultValue={7.5} showValue readonly />
          </Box>
          <Box>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Without Value Label
            </Text>
            <Review defaultValue={3} showValue={false} readonly />
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
};

export const CompleteShowcase: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Complete Review Showcase
        </Text>

        <VStack align="stretch" gap={8}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Sizes
            </Text>
            <HStack gap={8} align="center">
              <Review size="sm" defaultValue={2.5} showValue readonly />
              <Review size="md" defaultValue={3.5} showValue readonly />
              <Review size="lg" defaultValue={4.5} showValue readonly />
            </HStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Variants
            </Text>
            <HStack gap={8} align="center">
              <Review variant="default" defaultValue={4} showValue readonly />
              <Review variant="compact" defaultValue={4} showValue readonly />
              <Review variant="rated" rating={4.8} maxRating={5} />
            </HStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Interactive Mode
            </Text>
            <Review size="lg" defaultValue={0} showValue readonly={false} />
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
};
