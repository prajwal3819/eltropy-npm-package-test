import type { Meta, StoryObj } from '@storybook/react';
import { PhoneInput } from './PhoneInput';
import { VStack, Box, Heading } from '@chakra-ui/react';

const meta = {
  title: 'Components/Input/PhoneInput',
  component: PhoneInput,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the phone input'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled'
    },
    isRequired: {
      control: 'boolean',
      description: 'Whether the input is required'
    },
    isInvalid: {
      control: 'boolean',
      description: 'Whether the input is in an invalid state'
    },
    label: {
      control: 'text',
      description: 'Label text for the input'
    },
    subtext: {
      control: 'text',
      description: 'Subtext displayed below the label'
    },
    supportingText: {
      control: 'text',
      description: 'Supporting text displayed below the input'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    optionalText: {
      control: 'text',
      description: 'Optional text displayed next to the label'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input'
    },
    defaultValue: {
      control: 'text',
      description: 'Default value for the input'
    },
    onlyCountries: {
      control: 'object',
      description: 'Array of country codes to include'
    },
    excludeCountries: {
      control: 'object',
      description: 'Array of country codes to exclude'
    }
  }
} satisfies Meta<typeof PhoneInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    subtext: 'Label Subtext',
    supportingText: 'Supporting text'
  }
};

export const Typing: Story = {
  args: {
    label: 'Label',
    subtext: 'Label Subtext',
    supportingText: 'Supporting text',
    defaultValue: '12345'
  }
};

export const Filled: Story = {
  args: {
    label: 'Label',
    subtext: 'Label Subtext',
    supportingText: 'Supporting text',
    defaultValue: '1234567890'
  }
};

export const Error: Story = {
  args: {
    label: 'Label',
    subtext: 'Label Subtext',
    error: 'Error message',
    supportingText: 'Supporting text',
    defaultValue: '1234567890'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Label',
    subtext: 'Label Subtext',
    supportingText: 'Supporting text',
    defaultValue: '1234567890',
    disabled: true
  }
};

export const WithRequired: Story = {
  args: {
    label: 'Label',
    isRequired: true,
    supportingText: 'This field is required'
  }
};

export const WithOptional: Story = {
  args: {
    label: 'Label',
    optionalText: '(optional)',
    supportingText: 'This field is optional'
  }
};

export const WithoutLabel: Story = {
  args: {
    supportingText: 'Supporting text'
  }
};

export const AllStates: Story = {
  render: () => (
    <VStack align="stretch" gap={8} maxW="400px">
      <Box>
        <Heading size="md" mb={4}>
          Default State
        </Heading>
        <PhoneInput
          label="Label"
          subtext="Label Subtext"
          supportingText="Supporting text"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Typing State
        </Heading>
        <PhoneInput
          label="Label"
          subtext="Label Subtext"
          supportingText="Supporting text"
          defaultValue="12345"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Filled State
        </Heading>
        <PhoneInput
          label="Label"
          subtext="Label Subtext"
          supportingText="Supporting text"
          defaultValue="1234567890"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Error State
        </Heading>
        <PhoneInput
          label="Label"
          subtext="Label Subtext"
          error="Error message"
          supportingText="Supporting text"
          defaultValue="1234567890"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Disabled State
        </Heading>
        <PhoneInput
          label="Label"
          subtext="Label Subtext"
          supportingText="Supporting text"
          defaultValue="1234567890"
          disabled
        />
      </Box>
    </VStack>
  )
};

export const LabelVariations: Story = {
  render: () => (
    <VStack align="stretch" gap={6} maxW="400px">
      <Box>
        <Heading size="md" mb={4}>
          With Required Indicator
        </Heading>
        <PhoneInput label="Phone Number" isRequired />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          With Optional Text
        </Heading>
        <PhoneInput label="Phone Number" optionalText="(optional)" />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          With Label and Subtext
        </Heading>
        <PhoneInput label="Phone Number" subtext="Label Subtext" />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Without Label
        </Heading>
        <PhoneInput />
      </Box>
    </VStack>
  )
};

export const WithSupportingText: Story = {
  render: () => (
    <VStack align="stretch" gap={6} maxW="400px">
      <Box>
        <Heading size="md" mb={4}>
          With Supporting Text
        </Heading>
        <PhoneInput
          label="Phone Number"
          supportingText="We'll use this to contact you"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          With Error Message
        </Heading>
        <PhoneInput
          label="Phone Number"
          error="Please enter a valid phone number"
          defaultValue="123"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          With Both Supporting Text and Error
        </Heading>
        <PhoneInput
          label="Phone Number"
          error="Invalid format"
          supportingText="Format: (123) 456-7890"
          defaultValue="abc"
        />
      </Box>
    </VStack>
  )
};

export const CountryFiltering: Story = {
  render: () => (
    <VStack align="stretch" gap={6} maxW="400px">
      <Box>
        <Heading size="md" mb={4}>
          Only Specific Countries
        </Heading>
        <PhoneInput
          label="Phone Number"
          supportingText="Only US, Canada, and Mexico available"
          onlyCountries={['us', 'ca', 'mx']}
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Exclude Specific Countries
        </Heading>
        <PhoneInput
          label="Phone Number"
          supportingText="All countries except US"
          excludeCountries={['us']}
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          European Countries Only
        </Heading>
        <PhoneInput
          label="Phone Number"
          supportingText="European countries only"
          onlyCountries={['gb', 'fr', 'de', 'it', 'es', 'nl', 'pt']}
        />
      </Box>
    </VStack>
  )
};

export const WithDefaultValues: Story = {
  render: () => (
    <VStack align="stretch" gap={6} maxW="400px">
      <Box>
        <Heading size="md" mb={4}>
          Partial Number
        </Heading>
        <PhoneInput
          label="Phone Number"
          defaultValue="123456"
          supportingText="Partially filled phone number"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Complete Number
        </Heading>
        <PhoneInput
          label="Phone Number"
          defaultValue="8005551234"
          supportingText="Complete phone number"
        />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          With Formatting
        </Heading>
        <PhoneInput
          label="Phone Number"
          defaultValue="(800) 555-1234"
          supportingText="Pre-formatted number"
        />
      </Box>
    </VStack>
  )
};

export const InteractiveStates: Story = {
  render: () => (
    <VStack align="stretch" gap={6} maxW="400px">
      <Box>
        <Heading size="md" mb={4}>
          Default (Hover to see border change)
        </Heading>
        <PhoneInput label="Phone Number" />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Focus (Click to see focus state)
        </Heading>
        <PhoneInput label="Phone Number" />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Invalid State
        </Heading>
        <PhoneInput label="Phone Number" isInvalid defaultValue="123" />
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Disabled (Cannot interact)
        </Heading>
        <PhoneInput label="Phone Number" disabled defaultValue="1234567890" />
      </Box>
    </VStack>
  )
};

export const CompleteExample: Story = {
  render: () => (
    <VStack align="stretch" gap={8} maxW="400px">
      <Box>
        <Heading size="lg" mb={6}>
          Registration Form Example
        </Heading>

        <VStack align="stretch" gap={6}>
          <PhoneInput
            label="Primary Phone"
            isRequired
            supportingText="We'll send a verification code to this number"
          />

          <PhoneInput
            label="Secondary Phone"
            optionalText="(optional)"
            supportingText="Alternative contact number"
          />

          <PhoneInput
            label="Emergency Contact"
            isRequired
            supportingText="Must be a different number"
          />
        </VStack>
      </Box>
    </VStack>
  )
};
