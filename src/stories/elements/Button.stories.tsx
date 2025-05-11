import type { Meta, StoryObj } from '@storybook/react';
import { 
 Button
} from '../../components/library/elements/button/Button';

const meta: Meta<typeof Button> = {
  title: 'Elements/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {control:'select', options:['button', 'submit']},
    customClass: { control: 'text' },
    variant: {control:'radio', options:['primary', 'secondary', 'tertiary']},
  },
  args: {
    customClass: '',
    type: 'button',
    variant: 'primary'
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },

  render: (args) => {
    return (
        <Button {...args}>
            Primary Button
        </Button>
    )
  } 
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },

  render: (args) => {
    return (
        <Button {...args}>
            Secondary Button
        </Button>
    )
  } 
};
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
  },

  render: (args) => {
    return (
        <Button {...args}>
            Tertiary Button
        </Button>
    )
  } 
};