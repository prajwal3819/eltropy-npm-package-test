import type { Meta, StoryObj } from '@storybook/react';
import { PasswordInput } from './PasswordInput';
import { VStack, Text, Box } from '@chakra-ui/react';
import { useState } from 'react';

const meta = {
  title: 'Components/Input/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input field',
    },
    label: {
      control: 'text',
      description: 'Label text for the input',
    },
    subtext: {
      control: 'text',
      description: 'Subtext displayed below the label',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    supportingText: {
      control: 'text',
      description: 'Supporting text displayed below the input',
    },
    isRequired: {
      control: 'boolean',
      description: 'Shows required indicator (*)',
    },
    optionalText: {
      control: 'text',
      description: 'Optional text displayed next to label',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Marks the input as invalid',
    },
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Password',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Password Input Sizes
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput size="sm" label="Small (sm)" />
          <PasswordInput size="md" label="Medium (md)" />
          <PasswordInput size="lg" label="Large (lg)" />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          With Label
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput label="Password" />
          <PasswordInput label="New Password" isRequired />
          <PasswordInput label="Confirm Password" optionalText="(Optional)" />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const WithSubtext: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          With Subtext
        </Text>
        <PasswordInput
          label="Password"
          subtext="Your password must meet the requirements below"
        />
      </Box>
    </VStack>
  ),
};

export const Required: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Required Field
        </Text>
        <PasswordInput label="Password" isRequired />
      </Box>
    </VStack>
  ),
};

export const Optional: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Optional Field
        </Text>
        <PasswordInput label="Password" optionalText="(Optional)" />
      </Box>
    </VStack>
  ),
};

export const WithError: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Error State
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput
            label="Password"
            error="Password is required"
            isRequired
          />
          <PasswordInput
            label="New Password"
            error="Password must be at least 8 characters"
            defaultValue="short"
          />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const WithSupportingText: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          With Supporting Text
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput
            label="Password"
            disabled
            supportingText="This field is currently disabled"
          />
          <PasswordInput
            label="Password"
            error="Password is incorrect"
            supportingText="Please try again or reset your password"
          />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const Disabled: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Disabled State
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput label="Password" disabled />
          <PasswordInput
            label="Password"
            disabled
            defaultValue="DisabledPassword123!"
          />
          <PasswordInput
            label="Password"
            disabled
            supportingText="Password cannot be changed at this time"
          />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Validation States
        </Text>
        <VStack align="start" gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Empty (Default State)
            </Text>
            <PasswordInput label="Password" />
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Partially Valid (Some Requirements Met)
            </Text>
            <PasswordInput label="Password" defaultValue="Pass" />
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Invalid (Requirements Not Met)
            </Text>
            <PasswordInput label="Password" defaultValue="short" />
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Valid (All Requirements Met)
            </Text>
            <PasswordInput label="Password" defaultValue="Password123!" />
          </Box>
        </VStack>
      </Box>
    </VStack>
  ),
};

export const PasswordVisibilityToggle: Story = {
  render: () => {
    const [showFirst, setShowFirst] = useState(false);
    return (
      <VStack align="stretch" gap={6} p={6}>
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Password Visibility Toggle
          </Text>
          <VStack align="start" gap={4}>
            <Box>
              <Text fontSize="sm" mb={2}>
                Click the eye icon to toggle visibility
              </Text>
              <PasswordInput
                label="Password"
                defaultValue="SecurePassword123!"
              />
            </Box>
          </VStack>
        </Box>
      </VStack>
    );
  },
};

export const FocusStates: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Focus States
        </Text>
        <Text fontSize="sm" mb={4} color="gray.600">
          Click on the input to see the focus state. The eye icon color changes
          when focused.
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput label="Normal Focus" />
          <PasswordInput
            label="Focus with Error"
            error="Password is required"
          />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);

    return (
      <VStack align="stretch" gap={6} p={6}>
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Interactive Example
          </Text>
          <PasswordInput
            label="Create Password"
            subtext="Enter a strong password"
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onValidityChange={setIsValid}
          />
          <Box mt={4} p={4} bg={isValid ? 'green.50' : 'gray.50'} borderRadius="md">
            <Text fontSize="sm" fontWeight="semibold">
              Password Status: {isValid ? '✓ Valid' : '✗ Invalid'}
            </Text>
            <Text fontSize="xs" color="gray.600" mt={1}>
              Current value: {password || '(empty)'}
            </Text>
          </Box>
        </Box>
      </VStack>
    );
  },
};

export const CompleteShowcase: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Complete Password Input Showcase
        </Text>

        <VStack align="stretch" gap={8}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Sizes
            </Text>
            <VStack align="start" gap={3}>
              <PasswordInput size="sm" label="Small" />
              <PasswordInput size="md" label="Medium" />
              <PasswordInput size="lg" label="Large" />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Label Variations
            </Text>
            <VStack align="start" gap={3}>
              <PasswordInput label="Basic Label" />
              <PasswordInput label="Required Field" isRequired />
              <PasswordInput label="Optional Field" optionalText="(Optional)" />
              <PasswordInput
                label="With Subtext"
                subtext="Additional information goes here"
              />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              States
            </Text>
            <VStack align="start" gap={3}>
              <PasswordInput label="Default" />
              <PasswordInput label="With Value" defaultValue="Password123!" />
              <PasswordInput label="Disabled" disabled />
              <PasswordInput
                label="Error"
                error="Password is incorrect"
                isRequired
              />
              <PasswordInput
                label="Disabled with Supporting Text"
                disabled
                supportingText="This field cannot be edited"
              />
            </VStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Validation Progress
            </Text>
            <VStack align="start" gap={3}>
              <PasswordInput label="Empty" />
              <PasswordInput label="Too Short" defaultValue="Pass1!" />
              <PasswordInput label="Missing Uppercase" defaultValue="password1!" />
              <PasswordInput label="Missing Special Char" defaultValue="Password1" />
              <PasswordInput label="Valid Password" defaultValue="Password123!" />
            </VStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          All States
        </Text>
        <VStack align="start" gap={4}>
          <PasswordInput label="Default" />
          <PasswordInput label="With Value" defaultValue="Test123!" />
          <PasswordInput label="Focused" autoFocus />
          <PasswordInput label="Disabled" disabled />
          <PasswordInput label="Error" error="Invalid password" />
          <PasswordInput label="Required" isRequired />
          <PasswordInput
            label="Error with Supporting Text"
            error="Password is too weak"
            supportingText="Please use a stronger password"
          />
        </VStack>
      </Box>
    </VStack>
  ),
};

export const ControlledVsUncontrolled: Story = {
  render: () => {
    const [controlledValue, setControlledValue] = useState('Controlled123!');

    return (
      <VStack align="stretch" gap={6} p={6}>
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Controlled vs Uncontrolled
          </Text>
          <VStack align="start" gap={4}>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Controlled Component
              </Text>
              <PasswordInput
                label="Controlled"
                value={controlledValue}
                onChange={(e) => setControlledValue(e.target.value)}
              />
              <Text fontSize="xs" mt={2} color="gray.600">
                Value: {controlledValue}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Uncontrolled Component
              </Text>
              <PasswordInput
                label="Uncontrolled"
                defaultValue="Uncontrolled123!"
              />
            </Box>
          </VStack>
        </Box>
      </VStack>
    );
  },
};
