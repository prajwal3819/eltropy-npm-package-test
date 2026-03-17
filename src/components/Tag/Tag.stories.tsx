import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';
import { UserIcon } from '../../assets/icons';
import { HStack, VStack, Text } from '@chakra-ui/react';

const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'subtle'],
      description: 'The variant style of the tag',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'lg'],
      description: 'The size of the tag',
    },
    colorScheme: {
      control: 'select',
      options: [
        'red',
        'blue',
        'yellow',
        'green',
        'orange',
        'violet',
        'gray',
        'outlined',
      ],
      description: 'The color scheme of the tag',
    },
    closable: {
      control: 'boolean',
      description: 'Whether to show a close button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the tag is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    children: 'Tag',
    variant: 'solid',
    size: 'sm',
    colorScheme: 'gray',
  },
};

export const WithLeftIcon: Story = {
  args: {
    children: 'Tag',
    variant: 'solid',
    size: 'sm',
    colorScheme: 'blue',
    leftIcon: <UserIcon />,
  },
};

export const Closable: Story = {
  args: {
    children: 'Tag',
    variant: 'solid',
    size: 'sm',
    colorScheme: 'green',
    closable: true,
    onClose: () => alert('Tag closed'),
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Tag',
    variant: 'solid',
    size: 'sm',
    colorScheme: 'red',
    leftIcon: <UserIcon />,
    closable: true,
    onClose: () => alert('Tag closed'),
  },
};

export const Clickable: Story = {
  args: {
    children: 'Clickable Tag',
    variant: 'solid',
    size: 'sm',
    colorScheme: 'violet',
    onClick: () => alert('Tag clicked'),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Tag',
    variant: 'solid',
    size: 'sm',
    colorScheme: 'blue',
    disabled: true,
    leftIcon: <UserIcon />,
    closable: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <VStack align="flex-start" gap={4}>
      <HStack>
        <Tag size="sm" colorScheme="gray">
          Small
        </Tag>
        <Tag size="sm" colorScheme="gray" leftIcon={<UserIcon />}>
          With Icon
        </Tag>
        <Tag size="sm" colorScheme="gray" closable>
          Closable
        </Tag>
      </HStack>
      <HStack>
        <Tag size="md" colorScheme="gray">
          Medium
        </Tag>
        <Tag size="md" colorScheme="gray" leftIcon={<UserIcon />}>
          With Icon
        </Tag>
        <Tag size="md" colorScheme="gray" closable>
          Closable
        </Tag>
      </HStack>
      <HStack>
        <Tag size="lg" colorScheme="gray">
          Large
        </Tag>
        <Tag size="lg" colorScheme="gray" leftIcon={<UserIcon />}>
          With Icon
        </Tag>
        <Tag size="lg" colorScheme="gray" closable>
          Closable
        </Tag>
      </HStack>
    </VStack>
  ),
};

export const SolidColors: Story = {
  render: () => (
    <VStack align="flex-start" gap={4}>
      <HStack>
        <Text minW="80px">Red:</Text>
        <Tag size="lg" variant="solid" colorScheme="red">
          Tag
        </Tag>
        <Tag
          size="lg"
          variant="solid"
          colorScheme="red"
          leftIcon={<UserIcon />}
          closable
        >
          Tag
        </Tag>
        <Tag size="lg" variant="solid" colorScheme="red" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Blue:</Text>
        <Tag variant="solid" colorScheme="blue">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="blue" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="blue" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Yellow:</Text>
        <Tag variant="solid" colorScheme="yellow">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="yellow" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="yellow" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Green:</Text>
        <Tag variant="solid" colorScheme="green">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="green" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="green" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Orange:</Text>
        <Tag variant="solid" colorScheme="orange">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="orange" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="orange" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Violet:</Text>
        <Tag variant="solid" colorScheme="violet">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="violet" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="violet" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Gray:</Text>
        <Tag variant="solid" colorScheme="gray">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="gray" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="gray" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Outlined:</Text>
        <Tag variant="solid" colorScheme="outlined">
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="outlined" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="solid" colorScheme="outlined" closable>
          Tag
        </Tag>
      </HStack>
    </VStack>
  ),
};

export const SubtleColors: Story = {
  render: () => (
    <VStack align="flex-start" gap={4}>
      <HStack>
        <Text minW="80px">Red:</Text>
        <Tag variant="subtle" colorScheme="red">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="red" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="red" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Blue:</Text>
        <Tag variant="subtle" colorScheme="blue">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="blue" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="blue" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Yellow:</Text>
        <Tag variant="subtle" colorScheme="yellow">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="yellow" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="yellow" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Green:</Text>
        <Tag variant="subtle" colorScheme="green">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="green" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="green" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Orange:</Text>
        <Tag variant="subtle" colorScheme="orange">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="orange" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="orange" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Violet:</Text>
        <Tag variant="subtle" colorScheme="violet">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="violet" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="violet" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Gray:</Text>
        <Tag variant="subtle" colorScheme="gray">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="gray" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="gray" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Outlined:</Text>
        <Tag variant="subtle" colorScheme="outlined">
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="outlined" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag variant="subtle" colorScheme="outlined" closable>
          Tag
        </Tag>
      </HStack>
    </VStack>
  ),
};

export const States: Story = {
  render: () => (
    <VStack align="flex-start" gap={4}>
      <HStack>
        <Text minW="80px">Default:</Text>
        <Tag colorScheme="blue">Tag</Tag>
        <Tag colorScheme="blue" leftIcon={<UserIcon />}>
          Tag
        </Tag>
        <Tag colorScheme="blue" closable>
          Tag
        </Tag>
      </HStack>
      <HStack>
        <Text minW="80px">Disabled:</Text>
        <Tag colorScheme="blue" disabled>
          Tag
        </Tag>
        <Tag colorScheme="blue" leftIcon={<UserIcon />} disabled>
          Tag
        </Tag>
        <Tag colorScheme="blue" closable disabled>
          Tag
        </Tag>
      </HStack>
    </VStack>
  ),
};
