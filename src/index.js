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
import EditSong from 'EditSong'
import Songs from 'Songs'
import AddSong from 'AddSong'
import AddEvent from 'AddEvent'
import Events from 'Events'
import ViewEvent from 'ViewEvent'
import EditEvent from 'EditEvent'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Abel, sans-serif;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
  }

  button, input, select {
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
          <Route path="/songs/add" element={<AddSong />} />
          <Route path="/songs/:songId/edit" element={<EditSong />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/events/:eventId/edit" element={<EditEvent />} />
          <Route path="/events/:eventId">
            <Route path=":state" element={<ViewEvent />} />
            <Route path="" element={<ViewEvent />} />
          </Route>
          <Route path="/events/add" element={<AddEvent />} />
          <Route path="/events" element={<Events />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route element={<Layout wide />}>
          <Route path="/songs/:songId" element={<ViewSong />} />
        </Route>
        <Route index element={<Navigate to="/home" replace />} />
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
