import type { Meta, StoryObj } from '@storybook/react';
import { 
  Flyout, 
  FlyoutControl,
  FlyoutDialog
} from '../../components/library/components/flyout/Flyout';
import { FlyoutContext } from '../../components/library/components/flyout/FlyoutContext';
import { FlyoutProps } from '../../components/library/components/flyout/Flyout';

interface ExtendedFlyoutProps extends FlyoutProps {
  flyoutDialog?: {
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
    flyoutDialog: {
      customClass: { control: 'text' },
      position: { control: 'radio', options: ['fixed', 'absolute'] },
      role: { control: 'select', options: ['dialog', 'alertdialog'] },
      alignment: {control: 'select', options: ['right', 'left', 'top', 'bottom']},
      hasBackdrop: { control: 'boolean' },
    },
  },
  args: {
    open: false,
    flyoutDialog: {
      customClass: '',
      position: "fixed",
      alignment: 'right',
      role: "dialog",
      hasBackdrop: true
    },
  },
  subcomponents: {FlyoutControl, FlyoutDialog}
};

export default meta;
type Story = StoryObj<ExtendedFlyoutProps>;

export const Default: Story = {
  args: {
    ...meta.args, // not needed
    flyoutId: 'def-flyout',
    flyoutDialog: {
      "customClass": "def-flyout",
      "position": "fixed",
      "alignment": "top",
      "role": "dialog",
      "hasBackdrop": true
    }
  },

  render: (args) => {

    // Separate subcmop. - flyoutDialog args from args
    const { flyoutDialog, ...flyoutProps } = args;
    
    return (
      <Flyout {...flyoutProps}>
        <FlyoutControl />

        <FlyoutContext.Consumer>
          {(context) => {
            if (!context) return null;
            const { closeFlyout } = context;
            return (
              <FlyoutDialog {...flyoutDialog}>
                <section className='c-flyout__header'>
                  <button type='button' className='c-flyout__header-close' aria-label='close' onClick={closeFlyout} ></button>
                  <h2 className='c-flyout__header-title' id={args.flyoutId + '-title'}>Sample Flyout</h2>
                </section>
                <section className='c-flyout__body'>
                  Lorem Ipsum
                </section>
                <section className='c-flyout__footer'>
                  <button type='button' aria-label='Cancel' onClick={closeFlyout} >Cancel</button>
                  <button type='button' aria-label='Submit' onClick={closeFlyout} >Submit</button>
                </section>
              </FlyoutDialog>
            );
          }}
        </FlyoutContext.Consumer>
      </Flyout>
    )
  }
};