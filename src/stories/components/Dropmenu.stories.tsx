import type { Meta, StoryObj } from '@storybook/react';
import { Dropmenu } from '../../components/library/components/dropmenu/Dropmenu';

const meta: Meta<typeof Dropmenu> = {
  title: 'Components/Dropmenu',
  component: Dropmenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    customClass: { control: 'text' },
  },
  args: {
    customClass: '',
    id: 'def-checkbox',
  },
};

export default meta;
type Story = StoryObj<typeof Dropmenu>;

export const Default: Story = {
  render: (args) => {
    return (
        <Dropmenu {...args}/>
    )
  } 
};
