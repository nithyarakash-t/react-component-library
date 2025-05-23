import type { Meta, StoryObj } from '@storybook/react';
import { 
  Flyout
} from '../../components/library/components/flyout/Flyout';
import { FlyoutContext } from '../../components/library/components/flyout/FlyoutContext';
import { FlyoutProps } from '../../components/library/components/flyout/Flyout';
import { Button } from '../../components/library/elements/button/Button';

interface ExtendedFlyoutProps extends FlyoutProps {
  flyoutDialogProps?: {
    customClass?: string;
    position?: 'fixed' | 'absolute';
    role?: 'dialog' | 'alertdialog';
    alignment?: 'right' | 'left' | 'top' | 'bottom';
    hasBackdrop?: boolean;
  }
}

const meta: Meta<ExtendedFlyoutProps> = {
  title: 'Components/Flyout',
  component: Flyout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    flyoutId: { control: 'text' },
    open: { control: 'boolean' },
    
    // Flyout Dialog subcomponent controls
    flyoutDialogProps: {
      customClass: { control: 'text' },
      position: { control: 'radio', options: ['fixed', 'absolute'] },
      role: { control: 'select', options: ['dialog', 'alertdialog'] },
      alignment: {control: 'select', options: ['right', 'left', 'top', 'bottom']},
      hasBackdrop: { control: 'boolean' },
    },
  },
  args: {
    open: false,
    flyoutDialogProps: {
      customClass: '',
      position: "fixed",
      alignment: 'right',
      role: "dialog",
      hasBackdrop: true
    },
  },
  subcomponents: {FlyoutControl: Flyout.Control, FlyoutDialog: Flyout.Dialog, Button}
};

export default meta;
type Story = StoryObj<ExtendedFlyoutProps>;

export const Default: Story = {
  args: {
    ...meta.args, // not needed
    flyoutId: 'def-flyout',
    flyoutDialogProps: {
      "customClass": "def-flyout",
      "position": "fixed",
      "alignment": "right",
      "role": "dialog",
      "hasBackdrop": true
    }
  },

  render: (args) => {

    // Separate subcmop. - flyoutDialogProps args from args
    const { flyoutDialogProps, ...flyoutProps } = args;
    
    return (
      <Flyout {...flyoutProps}>
       <Flyout.Control>
          <Button type='button'>Open Flyout</Button>
       </Flyout.Control>

        <FlyoutContext.Consumer>
          {(context) => {
            if (!context) return null;
            const { closeFlyout } = context;
            return (
              <Flyout.Dialog {...flyoutDialogProps}>
                <section className='c-flyout__header'>
                  <button type='button' className='c-flyout__header-close' aria-label='close' onClick={closeFlyout} ></button>
                  <h2 className='c-flyout__header-title' id={args.flyoutId + '-title'}>Sample Flyout</h2>
                </section>
                <section className='c-flyout__body'>
                  Lorem Ipsum
                </section>
                <section className='c-flyout__footer'>
                  <Button type='button' aria-label='Cancel' onClick={closeFlyout} >Cancel</Button>
                  <Button type='button' aria-label='Submit' onClick={closeFlyout} >Submit</Button>
                </section>
              </Flyout.Dialog>
            );
          }}
        </FlyoutContext.Consumer>
      </Flyout>
    )
  }
};