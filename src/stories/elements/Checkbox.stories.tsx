import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../components/library/elements/checkbox/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Elements/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    id: { control: 'text' },
    customClass: { control: 'text' },
    content: { control: 'text' },
    disabled: {control:'boolean'},
  },
  args: {
    customClass: '',
    name: 'def-checkbox',
    id: 'def-checkbox',
    content: 'Sample Checkbox',
    disabled: false
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: (args) => {
    return (
        <Checkbox {...args}/>
    )
  } 
};

export const NoText: Story = {
  args: {
    content: '',
    name: 'notext-cb',
    id: 'notext-cb'
  },
  render: (args) => {
    return (
        <Checkbox {...args}/>
    )
  } 
};

export const Disabled: Story = {
  args: {
    disabled: true,
    name: 'disabled-cb',
    id: 'disabled-cb'
  },
  render: (args) => {
    return (
        <Checkbox {...args}/>
    )
  } 
};

export const CustomChildren: Story = {
  args: {
    content: 'I`m default span',
    name: 'custchild-cb',
    id: 'custchild-cb'
  },
  render: (args) => {
    return (
        <Checkbox {...args}>
            <p>I'm custom paragraph</p>
        </Checkbox>
    )
  } 
};