import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '../../components/library/elements/radio/Radio';

const meta: Meta<typeof Radio> = {
  title: 'Elements/Radio',
  component: Radio,
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
    name: 'def-radio',
    id: 'def-radio',
    content: 'Sample Radio',
    disabled: false
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  render: (args) => {
    return (
        <Radio {...args}/>
    )
  } 
};

export const NoText: Story = {
  args: {
    content: '',
    name: 'no-text-radio',
    id: 'no-text-radio'
  },
  render: (args) => {
    return (
        <Radio {...args}/>
    )
  } 
};

export const Disabled: Story = {
  args: {
    disabled: true,
    name: 'disabled-radio',
    id: 'disabled-radio'
  },
  render: (args) => {
    return (
        <Radio {...args}/>
    )
  } 
};

export const CustomChildren: Story = {
  args: {
    content: 'I`m default span',
    name: 'customchild-radio',
    id: 'customchild-radio'
  },
  render: (args) => {
    return (
        <Radio {...args}>
            <p>I'm custom paragraph</p>
        </Radio>
    )
  } 
};