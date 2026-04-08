import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Stack } from '@chakra-ui/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the checkbox',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

const DefaultRender = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(e) => setChecked(!!e.checked)}
    >
      Accept terms and conditions
    </Checkbox>
  );
};

export const Default: Story = {
  render: () => <DefaultRender />,
};

const CheckedRender = () => {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(e) => setChecked(!!e.checked)}
    >
      I agree to the terms
    </Checkbox>
  );
};

export const Checked: Story = {
  render: () => <CheckedRender />,
};

const SizesRender = () => {
  const [checkedSm, setCheckedSm] = useState(false);
  const [checkedMd, setCheckedMd] = useState(false);
  const [checkedLg, setCheckedLg] = useState(false);
  return (
    <Stack gap="16px" align="flex-start">
      <Checkbox
        size="sm"
        checked={checkedSm}
        onCheckedChange={(e) => setCheckedSm(!!e.checked)}
      >
        Small checkbox
      </Checkbox>
      <Checkbox
        size="md"
        checked={checkedMd}
        onCheckedChange={(e) => setCheckedMd(!!e.checked)}
      >
        Medium checkbox (default)
      </Checkbox>
      <Checkbox
        size="lg"
        checked={checkedLg}
        onCheckedChange={(e) => setCheckedLg(!!e.checked)}
      >
        Large checkbox
      </Checkbox>
    </Stack>
  );
};

export const Sizes: Story = {
  render: () => <SizesRender />,
};

export const Disabled: Story = {
  render: () => {
    return (
      <Stack gap="16px" align="flex-start">
        <Checkbox disabled>Disabled unchecked</Checkbox>
        <Checkbox disabled checked>
          Disabled checked
        </Checkbox>
      </Stack>
    );
  },
};

const WithoutLabelRender = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={(e) => setChecked(!!e.checked)}
    />
  );
};

export const WithoutLabel: Story = {
  render: () => <WithoutLabelRender />,
};

const MultipleCheckboxesRender = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const items = [
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue' },
    { id: 'angular', label: 'Angular' },
    { id: 'svelte', label: 'Svelte' },
  ];

  const handleChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  return (
    <Stack gap="12px" align="flex-start">
      {items.map((item) => (
        <Checkbox
          key={item.id}
          checked={selectedItems.includes(item.id)}
          onCheckedChange={(e) => handleChange(item.id, !!e.checked)}
        >
          {item.label}
        </Checkbox>
      ))}
    </Stack>
  );
};

export const MultipleCheckboxes: Story = {
  render: () => <MultipleCheckboxesRender />,
};

export const Indeterminate: Story = {
  render: () => {
    return (
      <Stack gap="16px" align="flex-start">
        <Checkbox checked="indeterminate" size="sm">
          Indeterminate (sm)
        </Checkbox>
        <Checkbox checked="indeterminate" size="md">
          Indeterminate (md)
        </Checkbox>
        <Checkbox checked="indeterminate" size="lg">
          Indeterminate (lg)
        </Checkbox>
      </Stack>
    );
  },
};

const IndeterminateInteractiveRender = () => {
  const items = [
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue' },
    { id: 'angular', label: 'Angular' },
  ];
  const [selected, setSelected] = useState<string[]>(['react']);

  const allChecked = selected.length === items.length;
  const indeterminate = selected.length > 0 && !allChecked;

  const handleSelectAll = () => {
    if (allChecked) {
      setSelected([]);
    } else {
      setSelected(items.map((i) => i.id));
    }
  };

  return (
    <Stack gap="12px" align="flex-start">
      <Checkbox
        checked={indeterminate ? 'indeterminate' : allChecked}
        onCheckedChange={handleSelectAll}
      >
        Select all
      </Checkbox>
      <Stack gap="8px" paddingLeft="24px">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            checked={selected.includes(item.id)}
            onCheckedChange={(e) => {
              if (e.checked) {
                setSelected([...selected, item.id]);
              } else {
                setSelected(selected.filter((id) => id !== item.id));
              }
            }}
          >
            {item.label}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  );
};

export const IndeterminateInteractive: Story = {
  render: () => <IndeterminateInteractiveRender />,
};

export const AllStates: Story = {
  render: () => {
    return (
      <Stack gap="16px" align="flex-start">
        <Checkbox>Default (unchecked)</Checkbox>
        <Checkbox checked>Checked</Checkbox>
        <Checkbox checked="indeterminate">Indeterminate</Checkbox>
        <Checkbox disabled>Disabled (unchecked)</Checkbox>
        <Checkbox disabled checked>
          Disabled (checked)
        </Checkbox>
      </Stack>
    );
  },
};

const InteractiveRender = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Stack gap="16px" align="flex-start">
      <Checkbox
        checked={checked}
        onCheckedChange={(e) => setChecked(!!e.checked)}
      >
        Subscribe to newsletter
      </Checkbox>
      <div>
        Status: <strong>{checked ? 'Subscribed' : 'Not subscribed'}</strong>
      </div>
    </Stack>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveRender />,
};
