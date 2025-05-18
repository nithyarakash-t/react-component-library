import type { Preview } from '@storybook/react'
import '../src/assets/styles/base/_base.scss'
import React from 'react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <React.Fragment>
        <Story />
      </React.Fragment>
    ),
  ],
};

export default preview;