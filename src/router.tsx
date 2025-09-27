import { Outlet, createBrowserRouter, redirect } from 'react-router'

import { getAuthState } from './backend/auth'
import { fetchRecentEvents } from './backend/events'
import { fetchSongs } from './backend/songs'
import Nav from './components/Nav'
import loadEvent from './loaders/loadEvent'
import loadSong from './loaders/loadSong'
import { ErrorBoundary } from './pages/ErrorBoundary'
import AddEventPage from './pages/EventAddPage'
import EditEventPage from './pages/EventEditPage'
import EventPage from './pages/EventPage'
import PrintEventPage from './pages/EventPrintPage'
import EventsPage from './pages/EventsPage'
import Login from './pages/LoginPage'
import NotFoundPage from './pages/NotFound'
import AddSongPage from './pages/SongAddPage'
import EditSongPage from './pages/SongEditPage'
import SongPage from './pages/SongPage'
import SongsPage from './pages/SongsPage'

const router = createBrowserRouter([
  {
    path: '/',
    ErrorBoundary: ErrorBoundary,
    loader: async ({ request }) => {
      const url = new URL(request.url)
      const authState = await getAuthState()
      if (authState.status === 'loggedOut' && url.pathname !== '/login') {
        return redirect(
          `/login?redirect=${encodeURIComponent(url.pathname + url.search)}`
        )
      } else if (authState.status === 'loggedIn' && url.pathname === '/login') {
        const redirectTo = url.searchParams.get('redirect')
        return redirect(
          redirectTo && redirectTo !== '/login' ? redirectTo : '/events'
        )
      }

      if (url.pathname === '/') {
        return redirect('/events' + url.search)
      }
    },
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        element: (
          <>
            <Nav />
            <main>
              <Outlet />
            </main>
          </>
        ),
        children: [
          {
            path: 'songs',
            children: [
              {
                index: true,
                loader: async () => fetchSongs(),
                Component: SongsPage
              },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    loader: loadSong,
                    Component: SongPage
                  },
                  {
                    path: 'edit',
                    loader: loadSong,
                    Component: EditSongPage
                  }
                ]
              },
              {
                path: 'add',
                Component: AddSongPage
              }
            ]
          },
          {
            path: 'events',
            children: [
              {
                index: true,
                loader: () => fetchRecentEvents(),
                Component: EventsPage
              },
              {
                path: ':id',
                children: [
                  {
                    index: true,
                    loader: loadEvent,
                    Component: EventPage
                  },
                  {
                    path: 'edit',
                    loader: loadEvent,
                    Component: EditEventPage
                  },
                  {
                    path: 'print',
                    loader: loadEvent,
                    Component: PrintEventPage
                  }
                ]
              },
              {
                path: 'add',
                Component: AddEventPage
              }
            ]
          },
          {
            path: 'not-found',
            Component: NotFoundPage
          },
          {
            path: '*',
            loader: () => redirect('/not-found')
          }
        ]
      }
    ]
  }
])

export default router
