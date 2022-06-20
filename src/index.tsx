import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import '@api/firebase'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import Home from '@features/Home'
import Layout from '@features/Shared/Layout'
import ViewSong from '@features/Songs/Song'
import EditSong from '@features/Songs/EditSong'
import Songs from '@features/Songs/Overview'
import AddSong from '@features/Songs/AddSong'
import AddEvent from '@features/Events/AddEvent'
import Events from '@features/Events/Overview'
import ViewEvent from '@features/Events/Event'
import EditEvent from '@features/Events/EditEvent'
import { Provider } from 'react-redux'
import store from '@store'
import { useAppDispatch, useAppSelector } from '@utils/hooks'
import { initializeUser, LoginStatus } from '@features/Auth/authSlice'
import DisplayErrors from '@features/Shared/DisplayErrors'
import Auth from '@features/Auth'

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
  const user = useAppSelector(state => state.auth.user)
  const ready = useAppSelector(state => state.auth.status !== LoginStatus.undetermined)
  const dispatch = useAppDispatch()
  const hasOrg = useAppSelector(state => !!state.auth.organisation)

  useEffect(function () {
    dispatch(initializeUser())
  }, [dispatch])

  if (!ready) {
    return null
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/songs/add" element={<AddSong />} />
        <Route path="/songs/:songId/edit" element={<EditSong />} />
        <Route path="/songs" element={<Songs />} />
        {hasOrg && (
          <>
            <Route path="/events/:eventId/edit" element={<EditEvent />} />
            <Route path="/events/:eventId">
              <Route path=":state" element={<ViewEvent />} />
              <Route path="" element={<ViewEvent />} />
            </Route>
            <Route path="/events/add" element={<AddEvent />} />
            <Route path="/events" element={<Events />} />
          </>
        )}
        <Route path="/home" element={<Home />} />
      </Route>
      <Route element={<Layout wide />}>
        <Route path="/songs/:songId" element={<ViewSong />} />
        {hasOrg && <Route path="/events/:eventId/songs/:songId" element={<ViewSong />} />}
      </Route>
      <Route index element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <div>
      <GlobalStyle />
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <DisplayErrors />
        </BrowserRouter>
      </Provider>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
)
