import React from 'react'
import { push } from 'gatsby'

import { handleAuthentication } from '../utils/auth'

const Callback = () => {
  handleAuthentication(() => push('/'))

  return (
    <div>
      Logging you in.
    </div>
  )
}

export default Callback
