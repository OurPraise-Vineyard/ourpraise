import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import DisplayErrors from '@components/DisplayErrors'
import Layout from '@components/Layout'
import useAuth from '@hooks/useAuth'
import Auth from '@pages/Auth'
import ViewEvent from '@pages/Event'
import AddEvent from '@pages/EventAdd'
import EditEvent from '@pages/EventEdit'
import Events from '@pages/Events'
import NoAccessView from '@pages/NoAccess'
import ViewSong from '@pages/Song'
import AddSong from '@pages/SongAdd'
import EditSong from '@pages/SongEdit'
import ViewSongList from '@pages/SongList'
import AddSongList from '@pages/SongListAdd'
import EditSongList from '@pages/SongListEdit'
import SongLists from '@pages/SongLists'
import Songs from '@pages/Songs'
import store from '@state/store'
import AppTheme from '@styles/AppTheme'
import GlobalStyle from '@styles/GlobalStyle'

function App() {
  const { user, ready } = useAuth()

  if (!ready) {
    return null
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        {!user.role && <Route path="*" element={<NoAccessView />} />}
        {(user.role === 'admin' || user.role === 'user') && (
          <>
            <Route path="/songs/add" element={<AddSong />} />
            <Route path="/songs/:songId/edit" element={<EditSong />} />
            <Route path="/songs/:songId" element={<ViewSong />} />
            <Route path="/songs" element={<Songs />} />
          </>
        )}
        {user.role === 'admin' && (
          <>
            <Route path="/events/:eventId/edit" element={<EditEvent />} />
            <Route path="/events/:eventId">
              <Route path=":state" element={<ViewEvent />} />
              <Route path="" element={<ViewEvent />} />
            </Route>
            <Route path="/events/add" element={<AddEvent />} />
            <Route path="/events" element={<Events />} />
            <Route
              path="/songlists/:songListId/edit"
              element={<EditSongList />}
            />
            <Route path="/songlists/:songListId">
              <Route path=":state" element={<ViewSongList />} />
              <Route path="" element={<ViewSongList />} />
            </Route>
            <Route path="/songlists/add" element={<AddSongList />} />
            <Route path="/songlists" element={<SongLists />} />
          </>
        )}
      </Route>
      <Route
        index
        element={
          <Navigate to={user.role === 'admin' ? '/events' : '/songs'} replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={AppTheme}>
      <GlobalStyle />
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <DisplayErrors />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
