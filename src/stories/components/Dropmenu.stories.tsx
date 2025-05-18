import type { Meta, StoryObj } from '@storybook/react';
import { Dropmenu, DropmenuControl, DropmenuMenu, DropmenuMenuProps, DropmenuProps } from '../../components/library/components/dropmenu/Dropmenu';
// import { DropmenuContext } from '../../components/library/components/dropmenu/DropmenuContext';

interface ExtendedDropmenuProps extends DropmenuProps {
  dropmenuMenuProps?: DropmenuMenuProps
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
  subcomponents: {DropmenuControl, DropmenuMenu}
};

export default meta;
type Story = StoryObj<ExtendedDropmenuProps>;

export const Default: Story = {
  render: (args) => {
    
    // Seperate subC
    const { dropmenuMenuProps, ...props } = args;

    return (
        <Dropmenu {...props}>
          <DropmenuControl>
            <button type='button'>Sample Dropenu</button>
          </DropmenuControl>
          <DropmenuMenu {...dropmenuMenuProps} />
        </Dropmenu>
    )
  } 
};
