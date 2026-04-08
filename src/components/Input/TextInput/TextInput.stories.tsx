import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';
import { VStack, Text, Box } from '@chakra-ui/react';
import { UserIcon } from '../../../assets/icons';

const meta = {
  title: 'Components/Input/TextInput',
  component: TextInput,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    disabled: {
      control: 'boolean'
    },
    isRequired: {
      control: 'boolean'
    },
    isInvalid: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    placeholder: 'Enter your text',
    size: 'md'
  }
};

export const AllSizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          TextInput Sizes
        </Text>
        <VStack align="start" gap={4}>
          <TextInput size="sm" placeholder="Small size" />
          <TextInput size="md" placeholder="Medium size" />
          <TextInput size="lg" placeholder="Large size" />
        </VStack>
      </Box>
    </VStack>
  )
};

export const AllStates: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          TextInput States
        </Text>
        <VStack align="start" gap={4}>
          <TextInput placeholder="Default state" />
          <TextInput disabled placeholder="Disabled state" />
          <TextInput isInvalid placeholder="Invalid state" />
          <TextInput
            error="This field has an error"
            placeholder="Error state"
          />
        </VStack>
      </Box>
    </VStack>
  )
};

export const WithLabels: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          TextInput with Labels
        </Text>
        <VStack align="start" gap={4}>
          <TextInput label="First Name" placeholder="Enter first name" />
          <TextInput
            label="Email Address"
            subtext="We'll never share your email"
            placeholder="Enter email"
          />
          <TextInput
            label="Phone Number"
            isRequired
            placeholder="Enter phone number"
          />
          <TextInput
            label="Last Name"
            optionalText="(Optional)"
            placeholder="Enter last name"
          />
        </VStack>
      </Box>
    </VStack>
  )
};

export const WithIcons: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          TextInput with Icons
        </Text>
        <VStack align="start" gap={4}>
          <TextInput leftIcon={<span>🔍</span>} placeholder="Search..." />
          <TextInput rightIcon={<span>→</span>} placeholder="Enter text" />
          <TextInput
            leftIcon={<UserIcon />}
            rightIcon={<span>✓</span>}
            placeholder="Username"
          />
        </VStack>
      </Box>
    </VStack>
  )
};

export const WithSupportingText: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          TextInput with Supporting Text
        </Text>
        <VStack align="start" gap={4}>
          <TextInput
            label="Password"
            supportingText="Must be at least 8 characters long"
            placeholder="Enter password"
          />
          <TextInput
            label="Confirm Password"
            error="Passwords do not match"
            placeholder="Confirm password"
          />
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
          Complete TextInput Showcase
        </Text>

        <VStack align="stretch" gap={8}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Sizes
            </Text>
            <VStack align="start" gap={3}>
              <TextInput size="sm" placeholder="Small input" />
              <TextInput size="md" placeholder="Medium input" />
              <TextInput size="lg" placeholder="Large input" />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              With Labels & Validation
            </Text>
            <VStack align="start" gap={4}>
              <TextInput
                label="Required Field"
                isRequired
                supportingText="This field is mandatory"
                placeholder="Required input"
              />
              <TextInput
                label="Optional Field"
                optionalText="(Optional)"
                placeholder="Optional input"
              />
              <TextInput
                label="Email"
                error="Please enter a valid email address"
                placeholder="Invalid email"
              />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              With Icons
            </Text>
            <VStack align="start" gap={3}>
              <TextInput leftIcon={<span>🔍</span>} placeholder="Search" />
              <TextInput
                rightIcon={<span>→</span>}
                onRightIconClick={() => alert('Icon clicked!')}
                placeholder="With clickable icon"
              />
              <TextInput leftIcon={<UserIcon />} placeholder="Username" />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              States
            </Text>
            <VStack align="start" gap={3}>
              <TextInput placeholder="Default" />
              <TextInput disabled placeholder="Disabled" />
              <TextInput isInvalid placeholder="Invalid" />
            </VStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  )
};
