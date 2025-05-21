import type { Meta, StoryObj } from '@storybook/react';
import { 
  Collapse,
  Accordion
} from '../../components/library/components/accordion/Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    customClass: { control: 'text' },
    accordionId: { control: 'text' },
  },
  args: {
    customClass: 'example-accordion'
  },
  // Add subcomponents so they appear in the docs
  subcomponents: { Collapse, CollapseControl : Collapse.Control, CollapseContent:Collapse.Content  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    accordionId: 'def-accordion',
  },

  render: (args) => {
    return (
     <Accordion {...args}>
         <Collapse customClass='acc-child-collapse' collapseId='acc-child-1' open={true}>
            <Collapse.Control>
                Collapse 1
            </Collapse.Control>
            <Collapse.Content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </Collapse.Content>
        </Collapse>
        <Collapse customClass='acc-child-collapse' collapseId='acc-child-2' open={false}>
            <Collapse.Control>
                Collapse 2
            </Collapse.Control>
            <Collapse.Content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </Collapse.Content>
        </Collapse>
     </Accordion>
    )
  }
    
};


export const Nested: Story = {
  args: {
    accordionId: 'nested-accordion-1',
    customClass: 'example-nested-accordion'
  },

  render: (args) => {
    return (
     <Accordion {...args}>
         <Collapse customClass='acc-child-collapse' collapseId='acc-nchild-1' open={false}>
            <Collapse.Control>
                Collapse 1
            </Collapse.Control>
            <Collapse.Content>
              <div style={{paddingLeft: '3rem'}}>
                <Accordion accordionId='nested-accordion-1-1'>
                  <Collapse customClass='acc-child-collapse-nested' collapseId='acc-nchild-1-1' open={true}>
                    <Collapse.Control>
                        Collapse 1-1
                    </Collapse.Control>
                    <Collapse.Content>
                        Inner Child
                    </Collapse.Content>
                  </Collapse>
                </Accordion>
              </div>
            </Collapse.Content>
        </Collapse>
        <Collapse customClass='acc-child-collapse' collapseId='acc-nchild-2' open={true}>
            <Collapse.Control>
                Collapse 2
            </Collapse.Control>
            <Collapse.Content>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </Collapse.Content>
        </Collapse>
     </Accordion>
    )
  }
    
};