import { addDecorator, addParameters } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import '../styles/index.css'

addDecorator(withKnobs)

addParameters({
  backgrounds: [
    { name: 'Light', value: '#F5F7F3', default: true },
    { name: 'Dark', value: '#1E141F' },
  ],
})
