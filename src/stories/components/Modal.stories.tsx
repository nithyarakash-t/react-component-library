import type { Meta, StoryObj } from '@storybook/react';
import { 
  Modal,
  ModalProps
} from '../../components/library/components/modal/Modal';
import { ModalContext } from '../../components/library/components/modal/ModalContext';
import { Button } from '../../components/library/elements/button/Button';

interface ExtendedModalProps extends ModalProps {
  modalDialogProps?: {
    customClass?: string;
    position?: 'fixed' | 'absolute';
    role?: 'dialog' | 'alertdialog';
    hasBackdrop?: boolean;
  }
}


const meta: Meta<ExtendedModalProps> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    modalId: { control: 'text' },
    open: { control: 'boolean' },

    // Modal Dialog subcomponent controls
    modalDialogProps: {
      customClass: { control: 'text' },
      position: { control: 'radio', options: ['fixed', 'absolute'] },
      role: { control: 'select', options: ['dialog', 'alertdialog'] },
      alignment: {control: 'select', options: ['right', 'left', 'top', 'bottom']},
      hasBackdrop: { control: 'boolean' },
    },

  },
  args: {
    modalId: 'def-modal',
    open: false,
    modalDialogProps: {
      customClass: '',
      position: "fixed",
      role: "dialog",
      hasBackdrop: true
    },
  },
  subcomponents: {ModalControl:Modal.Control, ModalDialog: Modal.Dialog, Button}
};

export default meta;
type Story = StoryObj<ExtendedModalProps>;

export const Default: Story = {
  args: {
    ...meta.args, // not needed
    modalId: 'def-modal',
    modalDialogProps: {
        "customClass": "def-modal",
        "position": "fixed",
        "role": "dialog",
        "hasBackdrop": true
      }
  },

  render: (args) => {
    
    // Separate subcmop. - modalDialogProps args from args
    const { modalDialogProps, ...modalProps } = args;

    return (
      <Modal {...modalProps}>
        <Modal.Control>
            <Button type='button'>Open Modal</Button>
        </Modal.Control>

        <ModalContext.Consumer>
          {(context) => {
                    // Alt. from claude - Use non-null assertion to tell TypeScript this won't be undefined
                    // const { closeDialog } = context!;

                    if (!context) return null;
                    const { closeDialog } = context;
                    return (
                      <Modal.Dialog {...modalDialogProps}>
                        <section className='c-modal__header'>
                            <button type='button' className='c-modal__header-close' aria-label='close' onClick={closeDialog} ></button>
                            <h2 className='c-modal__header-title' id={args.modalId + '-title'}>Sample Modal</h2>
                        </section>
                        <section className='c-modal__body'>
                          Lorem Ipsum
                        </section>
                        <section className='c-modal__footer'>
                          <Button type='button' aria-label='Cancel' onClick={closeDialog} >Cancel</Button>
                          <Button type='button' aria-label='Submit' onClick={closeDialog} >Submit</Button>
                        </section>
                    </Modal.Dialog>
                    );
            }}
        </ModalContext.Consumer>
      </Modal>
    )
  }
    
};