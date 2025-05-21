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
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    customClass: { control: 'text' },
    label: {control: 'text'},
    // subC
    dropmenuMenuProps: {
      placement: {control: 'select'},
      role: {control: 'select'},
    }
  },
  args: {
    customClass: '',
    id: 'def-dropmenu',
    label: 'Sample Action',
    // subC
    dropmenuMenuProps : {
      placement: 'bottom-start',
      role: 'listbox'
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
