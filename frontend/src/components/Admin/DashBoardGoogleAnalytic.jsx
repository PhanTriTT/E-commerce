import React, { useState, useEffect } from 'react'
import {
  renderButton,
  checkSignedIn,
} from './GoogleAnalytic/GoogleAuth/authUtils'
import Dashboard from '../Admin/GoogleAnalytic/Dashboard/dashboard'
import styled from 'styled-components'
import Footer from '../Admin/GoogleAnalytic/footer'
import { gapi } from 'gapi-script'

function DashBoardGoogleAnalytic() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const updateSignin = (signedIn) => {
    setIsSignedIn(signedIn)
    if (!signedIn) {
      renderButton()
    }
  }

  const init = () => {
    checkSignedIn()
      .then((signedIn) => {
        updateSignin(signedIn)
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignin)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    gapi.load('client:auth2', init)
  })

  return (
    <div style={{ textAlign: 'center' }}>
      {!isSignedIn ? (
        <>
          <Title>Google Analytics Dashboard</Title>
          <ButtonContainer>
            <div id='signin-button'></div>
          </ButtonContainer>
          <Footer />
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default DashBoardGoogleAnalytic

const ButtonContainer = styled.div`
  height: 70vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  padding-top: 10vmin;
  margin-top: 0;
`
