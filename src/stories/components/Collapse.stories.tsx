import type { Meta, StoryObj } from '@storybook/react';
import { 
  Collapse
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
    collapseId: { control: 'text' },
    open: { control: 'boolean' },
    // parentId: {control: 'text'}
  },
  args: {
    customClass: 'example-collapse'
  },
  // Add subcomponents so they appear in the docs
  subcomponents: { CollapseControl : Collapse.Control, CollapseContent:Collapse.Content },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Default: Story = {
  args: {
    collapseId: 'def-collapse',
    open: false,
  },

  render: (args) => {
    return (
      <Collapse {...args}>
        <Collapse.Control>
            Click to Toggle Collapse
        </Collapse.Control>
        <Collapse.Content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </Collapse.Content>
    </Collapse>
    )
  }
    
};