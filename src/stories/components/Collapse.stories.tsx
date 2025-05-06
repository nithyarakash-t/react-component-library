import type { Meta, StoryObj } from '@storybook/react';
import { 
  Collapse,
  CollapseControl,
  CollapseContent 
} from '../../components/library/components/accordion/Accordion';

const meta: Meta<typeof Collapse> = {
  title: 'Components/Collapse',
  component: Collapse,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    customClass: { control: 'text' },
    id: { control: 'text' },
    open: { control: 'boolean' },
  },
  // Add subcomponents so they appear in the docs
  subcomponents: { CollapseControl, CollapseContent },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Default: Story = {
  args: {
    id: 'def-collapse',
    open: false,
    customClass: 'example-collapse'
  },

  render: (args) => {
    return (
      <Collapse {...args}>
        <CollapseControl>
            Click to Toggle Collapse
        </CollapseControl>
        <CollapseContent>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </CollapseContent>
    </Collapse>
    )
  }
    
};