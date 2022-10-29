import { gapi } from 'gapi-script'
const initAuth = () => {
  const CLIENT_ID =
    '128631861617-9nofvh3b7b7811phjr8aftl5qtp59gl5.apps.googleusercontent.com'
  return window.gapi.auth2.init({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
  })
}

export const checkSignedIn = () => {
  return new Promise((resolve, reject) => {
    initAuth()
      .then(() => {
        const auth = gapi.auth2.getAuthInstance()
        resolve(auth.isSignedIn.get())
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const onSuccess = (googleUser) => {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName())
}

const onFailure = (error) => {
  console.error(error)
}

export const renderButton = () => {
  gapi.signin2.render('signin-button', {
    scope: 'profile email',
    width: 240,
    height: 50,
    longtitle: true,
    theme: 'dark',
    onsuccess: onSuccess,
    onfailure: onFailure,
  })
}

export const signOut = () => {
  gapi.auth2.getAuthInstance().signOut()
}
