import type { Meta, StoryObj } from '@storybook/react';
import { 
  Collapse,
  CollapseControl,
  CollapseContent ,
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
  // Add subcomponents so they appear in the docs
  subcomponents: { Collapse, CollapseControl, CollapseContent },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    accordionId: 'def-accordion',
    customClass: 'example-accordion'
  },

  render: (args) => {
    return (
     <Accordion {...args}>
         <Collapse customClass='acc-child-collapse' collapseId='acc-child-1' open={true}>
            <CollapseControl>
                Collapse 1
            </CollapseControl>
            <CollapseContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </CollapseContent>
        </Collapse>
        <Collapse customClass='acc-child-collapse' collapseId='acc-child-2' open={false}>
            <CollapseControl>
                Collapse 2
            </CollapseControl>
            <CollapseContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </CollapseContent>
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
            <CollapseControl>
                Collapse 1
            </CollapseControl>
            <CollapseContent>
              <div style={{paddingLeft: '3rem'}}>
                <Accordion accordionId='nested-accordion-1-1'>
                  <Collapse customClass='acc-child-collapse-nested' collapseId='acc-nchild-1-1' open={true}>
                    <CollapseControl>
                        Collapse 1-1
                    </CollapseControl>
                    <CollapseContent>
                        Inner Child
                    </CollapseContent>
                  </Collapse>
                </Accordion>
              </div>
            </CollapseContent>
        </Collapse>
        <Collapse customClass='acc-child-collapse' collapseId='acc-nchild-2' open={true}>
            <CollapseControl>
                Collapse 2
            </CollapseControl>
            <CollapseContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
            </CollapseContent>
        </Collapse>
     </Accordion>
    )
  }
    
};