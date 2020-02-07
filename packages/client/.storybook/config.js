import React from 'react'
import { addDecorator, addParameters } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import '../styles/index.css'

addDecorator(withKnobs)

addDecorator(story => <div className="container mx-auto">{story()}</div>)

addParameters({
  backgrounds: [
    { name: 'Light', value: '#F5F7F3', default: true },
    { name: 'Dark', value: '#1E141F' },
  ],
})
