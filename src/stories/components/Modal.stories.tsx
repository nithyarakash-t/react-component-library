import type { Meta, StoryObj } from '@storybook/react';
import { 
  Modal, 
  ModalControl
} from '../../components/library/components/modal/Modal';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    customClass: { control: 'text' },
    modalId: { control: 'text' },
    position: {control:'radio', options: ['fixed', 'absolute']},
    role: {control:'select', options: ['dialog', 'alertdialog']},
    open: { control: 'boolean' },
    hasBackdrop: {control: 'boolean'},
  },
  args: {
    position: "fixed",
    role: "dialog",
    open: true,
    hasBackdrop: true
  },
  subcomponents: {ModalControl}
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    ...meta.args, // not needed
    modalId: 'def-modal',
    customClass: 'example-modal',
  },

  render: (args) => {
    return (
      <Modal {...args}>
        <ModalControl />
      </Modal>
    )
  }
    
};