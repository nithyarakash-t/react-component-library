import type { Meta, StoryObj } from '@storybook/react';
import { Dropmenu, DropmenuMenuProps, DropmenuProps } from '../../components/library/components/dropmenu/Dropmenu';
import { TEST_OPTIONS } from '../../components/library/components/dropmenu/dump/testOptions';
import { ReactNode } from 'react';
// import { DropmenuContext } from '../../components/library/components/dropmenu/DropmenuContext';

interface StoryDropmenuMenuProps extends Omit<DropmenuMenuProps, 'children'> {
  children?: ReactNode; // children is mandatory in props, we want to make it optional
}
interface ExtendedDropmenuProps extends DropmenuProps {
  dropmenuMenuProps?: StoryDropmenuMenuProps
}

const meta: Meta<ExtendedDropmenuProps> = {
  title: 'Components/Dropmenu',
  component: Dropmenu,
  parameters: {
    layout: 'centered',
    subcomponents: {
        'Dropmenu.Menu': {
          description: 'Menu subcomponent for Dropmenu',
          props: {
            placement: {
              description: 'Placement of the menu relative to the control',
              type: { name: 'enum', value: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end'] },
              defaultValue: 'top-start'
            },
            role: {
              description: 'ARIA role for the menu',
              type: { name: 'enum', value: ['menu', 'dialog', 'listbox', 'grid', 'tree'] },
              defaultValue: 'menu'
            },
            position: {
              description: 'Positioning strategy - static or dynamic',
              type: { name: 'enum', value: ['static', 'dynamic'] },
              defaultValue: 'dynamic'
            },
            strategy: {
              description: 'CSS positioning strategy',
              type: { name: 'enum', value: ['absolute', 'fixed'] },
              defaultValue: 'absolute'
            },
            offset: {
              description: 'Offset distance from the control',
              type: { name: 'number' },
              defaultValue: 2
            }
          }
        }
      }
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    customClass: { control: 'text' },
    label: {control: 'text'},
    // subC
    dropmenuMenuProps: {
      description: 'Props for the Dropmenu.Menu subcomponent',
      control: 'object',
      placement: { 
        control: 'select',
        options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'right', 'right-start', 'right-end', 'left', 'left-start', 'left-end']
      },
      role: { 
        control: 'select',
        options: ['menu', 'dialog', 'listbox', 'grid', 'tree']
      },
      position: {
        control: 'select',
        options: ['static', 'dynamic']
      },
      strategy: {
        control: 'select', 
        options: ['absolute', 'fixed']
      },
      offset: {
        control: 'number'
      }
    }
  },
  args: {
    customClass: '',
    id: 'def-dropmenu',
    label: 'Sample Action',
    // subC
    dropmenuMenuProps : {
      placement: 'bottom-start',
      role: 'listbox',
      position: 'dynamic',
      strategy: 'absolute',
      offset: 2
    }
  },
  subcomponents: {
    DropmenuControl: Dropmenu.Control, 
    DropmenuMenu: Dropmenu.Menu,
    DropmenuOption: Dropmenu.Option 
  }
};

//BUG
/**
 * On DropmenuControl code doesnt say Dropmenu.Control in storybook
 */

export default meta;
type Story = StoryObj<ExtendedDropmenuProps>;

export const Default: Story = {
  render: (args) => {
    
    // Seperate subC
    const { dropmenuMenuProps, ...props } = args;

    return (
        <Dropmenu {...props}>
          <Dropmenu.Control>
            <button type='button'>Sample Dropenu</button>
          </Dropmenu.Control>
          <Dropmenu.Menu {...dropmenuMenuProps}>
            {TEST_OPTIONS.map((option, index)=>{
              return (
                <Dropmenu.Option key={"djfnrkl" + index} >
                    <button role="option" className="c-dropmenu__item" id={"dcnldknc" + "-option-" + index} >
                      {option}
                  </button>
                </Dropmenu.Option>
              )
          })}
          </Dropmenu.Menu>
        </Dropmenu>
    )
  } 
};
