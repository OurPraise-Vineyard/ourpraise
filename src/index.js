import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import 'api/firebase'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Home from 'Home'
import Login from 'Login'
import Layout from 'Shared/Layout'
import ViewSong from 'ViewSong'
import { observeAuthState } from 'api/auth'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Abel, sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button, input {
    box-sizing: border-box;
    font-family: Abel, sans-serif;
    font-size: 16px;
  }
`

function App () {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(function () {
    observeAuthState(function (nextUser) {
      setReady(true)
      setUser(nextUser)
    })
  }, [])

  console.log(user)

  if (!ready) {
    return null
  }

  if (!user) {
    return <Login />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/songs/:songId' element={<ViewSong />} />
          <Route path='/home' element={<Home />} />
        </Route>
        <Route index element={<Navigate to='/home' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <div>
      <GlobalStyle />
      <App />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)
