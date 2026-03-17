import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, type TooltipProps } from './Tooltip';
import { Button } from '@chakra-ui/react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Tooltip component with arrow support and multiple placement options. Character limit: 100'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    showArrow: {
      control: 'boolean',
      description: 'Show or hide the tooltip arrow'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the tooltip'
    },
    openDelay: {
      control: 'number',
      description: 'Delay in ms before showing tooltip'
    },
    closeDelay: {
      control: 'number',
      description: 'Delay in ms before hiding tooltip'
    },
    placement: {
      control: 'select',
      options: [
        'top',
        'bottom',
        'left',
        'right',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'left-end',
        'right-start',
        'right-end'
      ],
      description: 'Tooltip placement relative to trigger'
    },
    content: {
      control: 'text',
      description: 'The text or element inside the tooltip'
    }
  }
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showArrow: true,
    content: 'I appear on hover',
    placement: 'top'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Hover Me
      </Button>
    </Tooltip>
  )
};

export const Top: Story = {
  args: {
    showArrow: true,
    content: 'I appear on hover',
    placement: 'top'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Top
      </Button>
    </Tooltip>
  )
};

export const Bottom: Story = {
  args: {
    showArrow: true,
    content: 'I appear on hover',
    placement: 'bottom'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Bottom
      </Button>
    </Tooltip>
  )
};

export const Left: Story = {
  args: {
    showArrow: true,
    content: 'I appear on hover',
    placement: 'left'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Left
      </Button>
    </Tooltip>
  )
};

export const Right: Story = {
  args: {
    showArrow: true,
    content: 'I appear on hover',
    placement: 'right'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Right
      </Button>
    </Tooltip>
  )
};

export const WithoutArrow: Story = {
  args: {
    showArrow: false,
    content: 'I appear on hover',
    placement: 'top'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Without Arrow
      </Button>
    </Tooltip>
  )
};

export const LongContent: Story = {
  args: {
    showArrow: true,
    content:
      'This is a longer tooltip message that demonstrates how the tooltip handles text that exceeds the character limit recommendation of 100 characters.',
    placement: 'top'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Long Content
      </Button>
    </Tooltip>
  )
};

export const Disabled: Story = {
  args: {
    disabled: true,
    content: 'This tooltip is disabled',
    placement: 'top'
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Disabled Tooltip
      </Button>
    </Tooltip>
  )
};

export const CustomDelay: Story = {
  args: {
    showArrow: true,
    content: 'I appear on hover',
    placement: 'top',
    openDelay: 500,
    closeDelay: 200
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="outline" size="md">
        Custom Delay (500ms)
      </Button>
    </Tooltip>
  )
};
