import { addDecorator, configure } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

addDecorator(withKnobs)

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /bs.js$/), module)
