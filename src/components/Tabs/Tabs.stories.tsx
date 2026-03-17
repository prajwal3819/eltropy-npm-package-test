import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@chakra-ui/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['line', 'enclosed'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  ),
  args: {
    defaultValue: 'tab1',
  },
};

export const WithBadge: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value="tab1" badge={4}>
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger value="tab2" badge={12}>
          Tab 2
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  ),
  args: {
    defaultValue: 'tab1',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled>
          Tab 2
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3" disabled badge={10}>
          Tab 3
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  ),
  args: {
    defaultValue: 'tab1',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap={8}>
      <Tabs {...args} size="sm">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Small</Tabs.Trigger>
          <Tabs.Trigger value="tab2" badge={5}>
            Small
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <Tabs {...args} size="md">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Medium</Tabs.Trigger>
          <Tabs.Trigger value="tab2" badge={10}>
            Medium
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <Tabs {...args} size="lg">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Large</Tabs.Trigger>
          <Tabs.Trigger value="tab2" badge={15}>
            Large
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    </Stack>
  ),
  args: {
    defaultValue: 'tab1',
  },
};
