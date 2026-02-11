import React from 'react';
import Card from './Card';
import Button from '../Button/Button';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    title: { control: 'text' },
    children: { control: null },
  },
};

const Template = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Card Title',
  children: (
    <div>
      <p>This is a basic card with some content inside it.</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <Button label="Action 1" variant="primary" />
        <Button label="Action 2" variant="secondary" />
      </div>
    </div>
  ),
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  children: (
    <div>
      <p>This card doesn't have a title.</p>
      <p>It can still contain any content.</p>
    </div>
  ),
};

export const WithCustomStyles = Template.bind({});
WithCustomStyles.args = {
  title: 'Custom Styled Card',
  className: 'custom-card', // You can add custom class names
  children: 'This card has custom styling applied.',
};

// You can add custom styles for the story using the parameters
WithCustomStyles.parameters = {
  styles: {
    style: {
      '.custom-card': {
        border: '2px dashed #4f46e5',
      },
    },
  },
};
