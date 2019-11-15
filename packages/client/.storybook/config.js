import { addDecorator, addParameters, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

addDecorator(withKnobs)

addParameters({
  backgrounds: [
    { name: 'Light', value: '#F5F7F3', default: true },
    { name: 'Dark', value: '#1E141F' }
  ]
})

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /bs.js$/), module)
