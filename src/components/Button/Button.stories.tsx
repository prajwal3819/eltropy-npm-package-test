import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { HStack, VStack, Text, Box } from '@chakra-ui/react';
import { SettingsIcon, UserIcon } from '../../assets/icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'outlined',
        'outlinedFilled',
        'ghost',
        'textLink',
        'danger',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const AllVariants: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Button Variants
        </Text>
        <HStack gap={4} wrap="wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="outlinedFilled">Outlined Filled</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="textLink">Text Link</Button>
          <Button variant="danger">Danger</Button>
        </HStack>
      </Box>
    </VStack>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Button Sizes
        </Text>
        <HStack gap={4} align="center">
          <Button size="xs">XS</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">XL</Button>
        </HStack>
        {/* <Button size='lg' w={'100%'}>Full Width</Button> */}
      </Box>
    </VStack>
  ),
};

export const AllStates: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Button States
        </Text>
        <HStack gap={4} wrap="wrap">
          <Button size="xl">Default</Button>
          <Button size="xl" disabled>
            Disabled
          </Button>
          <Button size="xl" loading>
            Loading
          </Button>
          <Button size="xl" loading loadingText="Loading">
            Loading with Text
          </Button>
          <Button size="xl" variant="danger">
            Danger
          </Button>
        </HStack>
      </Box>
    </VStack>
  ),
};

export const WithLeftIcon: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Buttons with Left Icon
        </Text>
        <VStack align="start" gap={3}>
          <Button size="xs" leftIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="sm" leftIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="md" leftIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="lg" leftIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="xl" leftIcon={<UserIcon />}>
            Add User
          </Button>
        </VStack>
      </Box>
    </VStack>
  ),
};

export const WithRightIcon: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Buttons with Right Icon
        </Text>
        <VStack align="start" gap={3}>
          <Button size="xs" rightIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="sm" rightIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="md" rightIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="lg" rightIcon={<UserIcon />}>
            Add User
          </Button>
          <Button size="xl" rightIcon={<UserIcon />}>
            Add User
          </Button>
        </VStack>
      </Box>
    </VStack>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Icon Only Buttons
        </Text>
        <HStack gap={4} align="center">
          <Button size="xs" iconOnly leftIcon={<UserIcon />} aria-label="Add" />
          <Button size="sm" iconOnly leftIcon={<UserIcon />} aria-label="Add" />
          <Button size="md" iconOnly leftIcon={<UserIcon />} aria-label="Add" />
          <Button size="lg" iconOnly leftIcon={<UserIcon />} aria-label="Add" />
          <Button size="xl" iconOnly leftIcon={<UserIcon />} aria-label="Add" />
        </HStack>
      </Box>
    </VStack>
  ),
};

export const SplitButton: Story = {
  render: () => (
    <VStack align="stretch" gap={6} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Split Buttons
        </Text>
        <HStack gap={3}>
          <Button
            size="xs"
            variant="primary"
            leftIcon={<UserIcon />}
            splitButton={<SettingsIcon />}
          >
            Label
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<UserIcon />}
            splitButton={<SettingsIcon />}
          >
            Label
          </Button>
          <Button
            size="md"
            loading={true}
            variant="primary"
            leftIcon={<UserIcon />}
            splitButton={<SettingsIcon />}
          >
            Label
          </Button>
          <Button
            size="lg"
            disabled
            variant="primary"
            leftIcon={<UserIcon />}
            splitButton={<SettingsIcon />}
          >
            Label
          </Button>
          <Button
            size="xl"
            variant="primary"
            leftIcon={<UserIcon />}
            splitButton={<SettingsIcon />}
          >
            Label
          </Button>
        </HStack>
      </Box>
    </VStack>
  ),
};

export const VariantShowcase: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Primary Variant
        </Text>
        <HStack gap={4}>
          <Button variant="primary">Default</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" loading>
            Loading
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Outlined Variant
        </Text>
        <HStack gap={4}>
          <Button variant="outlined">Default</Button>
          <Button variant="outlined" disabled>
            Disabled
          </Button>
          <Button variant="outlined" loading>
            Loading
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Outlined Filled Variant
        </Text>
        <HStack gap={4}>
          <Button variant="outlinedFilled">Default</Button>
          <Button variant="outlinedFilled" disabled>
            Disabled
          </Button>
          <Button variant="outlinedFilled" loading>
            Loading
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Ghost Variant
        </Text>
        <HStack gap={4}>
          <Button variant="ghost">Default</Button>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
          <Button variant="ghost" loading>
            Loading
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Text Link Variant
        </Text>
        <HStack gap={4}>
          <Button variant="textLink">Default</Button>
          <Button variant="textLink" disabled>
            Disabled
          </Button>
        </HStack>
      </Box>

      <Box>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Danger Variant
        </Text>
        <HStack gap={4}>
          <Button variant="danger">Default</Button>
          <Button variant="danger" disabled>
            Disabled
          </Button>
          <Button variant="danger" loading>
            Loading
          </Button>
        </HStack>
      </Box>
    </VStack>
  ),
};

export const CompleteShowcase: Story = {
  render: () => (
    <VStack align="stretch" gap={8} p={6}>
      <Box>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Complete Button Showcase
        </Text>

        <VStack align="stretch" gap={8}>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Sizes (Primary Variant)
            </Text>
            <HStack gap={4} align="center">
              <Button size="xs">XS</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">XL</Button>
            </HStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              With Icons
            </Text>
            <HStack gap={4} wrap="wrap">
              <Button leftIcon={<UserIcon />}>Left Icon</Button>
              <Button rightIcon={<UserIcon />}>Right Icon</Button>
              <Button iconOnly leftIcon={<UserIcon />} aria-label="Add" />
              <Button size="xl" splitButton={<SettingsIcon />}>
                Split Button
              </Button>
            </HStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              All Variants
            </Text>
            <HStack gap={4} wrap="wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="outlinedFilled">Outlined Filled</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="textLink">Text Link</Button>
              <Button variant="danger">Danger</Button>
            </HStack>
          </Box>

          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              States
            </Text>
            <HStack gap={4} wrap="wrap">
              <Button>Default</Button>
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
              <Button loading loadingText="Saving">
                With Text
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  ),
};
