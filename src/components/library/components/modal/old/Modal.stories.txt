import type { Meta, StoryObj } from '@storybook/react';
import { 
  Modal, 
  ModalBody, 
  ModalControl,
  ModalFooter,
  ModalHeader
} from '../../components/library/components/modal/Modal';
import { ModalContext } from '../../components/library/components/modal/ModalContext';

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
  subcomponents: {ModalControl, ModalHeader, ModalBody, ModalFooter}
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

        <ModalHeader>
            <ModalContext.Consumer>
                {(context) => {
                    // Alt. from claude - Use non-null assertion to tell TypeScript this won't be undefined
                    // const { closeDialog } = context!;

                    if (!context) return null;
                    const { closeDialog } = context;
                    return (
                        <>
                            <button type='button' className='c-modal__header-close' aria-label='close' onClick={closeDialog} ></button>
                            <h2 className='c-modal__header-title' id={args.modalId + '-title'}>Sample Modal</h2>
                        </>
                    );
                }}
            </ModalContext.Consumer>
        </ModalHeader>
        
        <ModalBody>
            Lorem ipsum
        </ModalBody>
        
        <ModalFooter>
            <button>Cancel</button>
            <button>Submit</button>
        </ModalFooter>
      </Modal>
    )
  }
    
};