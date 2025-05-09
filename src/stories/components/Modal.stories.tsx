import type { Meta, StoryObj } from '@storybook/react';
import { 
  Modal, 
  ModalControl,
  ModalDialog
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
    modalId: { control: 'text' },
    open: { control: 'boolean' },
    // dialog ----
    hasBackdrop: {control: 'boolean'},    
    customClass: { control: 'text' },
    position: {control:'radio', options: ['fixed', 'absolute']},
    role: {control:'select', options: ['dialog', 'alertdialog']},

  },
  args: {
    modalId: 'def-modal',
    open: false,
    // dialog ----
    position: "fixed",
    role: "dialog",
    hasBackdrop: true
  },
  subcomponents: {ModalControl, ModalDialog}
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    ...meta.args, // not needed
    modalId: 'def-modal',
    // dialog ----
    customClass: 'example-modal',
  },

  render: (args) => {
    return (
      <Modal {...args}>
        <ModalControl />

        <ModalContext.Consumer>
          {(context) => {
                    // Alt. from claude - Use non-null assertion to tell TypeScript this won't be undefined
                    // const { closeDialog } = context!;

                    if (!context) return null;
                    const { closeDialog } = context;
                    return (
                      <ModalDialog>
                        <section className='c-modal__header'>
                            <button type='button' className='c-modal__header-close' aria-label='close' onClick={closeDialog} ></button>
                            <h2 className='c-modal__header-title' id={args.modalId + '-title'}>Sample Modal</h2>
                        </section>
                        <section className='c-modal__body'>
                          Lorem Ipsum
                        </section>
                        <section className='c-modal__footer'>
                          <button type='button' aria-label='Cancel' onClick={closeDialog} >Cancel</button>
                          <button type='button' aria-label='Submit' onClick={closeDialog} >Submit</button>
                        </section>
                    </ModalDialog>
                    );
            }}
        </ModalContext.Consumer>
      </Modal>
    )
  }
    
};