import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import Auth from '@pages/Auth'
import ViewEvent from '@pages/Event'
import AddEvent from '@pages/EventAdd'
import EditEvent from '@pages/EventEdit'
import Events from '@pages/Events'
import NoAccessView from '@pages/NoAccess'
import PrintEvent from '@pages/PrintEvent'
import ViewSong from '@pages/Song'
import AddSong from '@pages/SongAdd'
import EditSong from '@pages/SongEdit'
import Songs from '@pages/Songs'

import DisplayErrors from '@components/DisplayErrors'
import Layout from '@components/Layout'

import useAuth from '@hooks/useAuth'
import store from '@state/store'

import './index.css'

function App() {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <p className="flex h-screen w-screen items-center justify-center">
        Loading...
      </p>
    )
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
            <Route path="/events/:eventId/edit" element={<EditEvent />} />
            <Route path="/events/add" element={<AddEvent />} />
          </>
        )}
        <Route path="/songs/:songId" element={<ViewSong />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/events/:eventId/print" element={<PrintEvent />} />
        <Route path="/events/:eventId" element={<ViewEvent />} />
        <Route path="/events" element={<Events />} />
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

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <DisplayErrors />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
