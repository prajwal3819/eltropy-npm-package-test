import React from 'react';
import Badge from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: [
          'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'
        ],
      },
    },
  },
};

const Template = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'Badge',
  color: 'gray',
};

// Showcase all color variants
export const AllVariants = () => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Badge text="Gray" color="gray" />
    <Badge text="Red" color="red" />
    <Badge text="Yellow" color="yellow" />
    <Badge text="Green" color="green" />
    <Badge text="Blue" color="blue" />
    <Badge text="Indigo" color="indigo" />
    <Badge text="Purple" color="purple" />
    <Badge text="Pink" color="pink" />
  </div>
);

// Example of using badges in context
export const InContext = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
    <div>
      <h3>Project Status</h3>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Badge text="Active" color="green" />
        <Badge text="Version 1.0.0" color="blue" />
        <Badge text="Stable" color="green" />
      </div>
    </div>
    
    <div>
      <h3>Task Priority</h3>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <Badge text="High" color="red" />
        <Badge text="Medium" color="yellow" />
        <Badge text="Low" color="gray" />
      </div>
    </div>
  </div>
);
