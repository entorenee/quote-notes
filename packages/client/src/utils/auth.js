import auth0js from 'auth0-js'

const isBrowser = typeof window !== 'undefined'

const auth0 = isBrowser
  ? new auth0js.WebAuth({
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENTID,
      redirectUri: process.env.AUTH0_AUDIENCE,
      responseType: 'token id_token',
      scope: 'openid profile',
    })
  : {}

export const login = () => {
  if (!isBrowser) {
    return
  }

  auth0.authorize()
}

const setSession = authResult => {
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  )
  localStorage.setItem('access_token', authResult.accessToken)
  localStorage.setItem('id_token', authResult.idToken)
  localStorage.setItem('expires_at', expiresAt)
  console.log(authResult)
}

export const handleAuthentication = callback => {
  if (!isBrowser) {
    return
  }

  auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      setSession(authResult)
      callback()
    } else if (err) {
      console.log(err)
    }
  })
}
