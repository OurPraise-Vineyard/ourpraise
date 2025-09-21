import { Outlet, createBrowserRouter, redirect } from 'react-router'

import { getAuthState } from './backend/auth'
import { fetchRecentEvents } from './backend/events'
import { fetchSongs } from './backend/songs'
import Nav from './components/Nav'
import loadEvent from './loaders/loadEvent'
import loadSong from './loaders/loadSong'
import { ErrorBoundary } from './pages/ErrorBoundary'
import EditEventPage from './pages/Event/EditPage'
import EventPage from './pages/Event/Page'
import PrintEventPage from './pages/Event/PrintPage'
import AddEventPage from './pages/Events/AddPage'
import EventsPage from './pages/Events/Page'
import Login from './pages/LoginPage'
import NotFoundPage from './pages/NotFound'
import EditSongPage from './pages/Song/EditPage'
import SongPage from './pages/Song/Page'
import AddSongPage from './pages/Songs/AddPage'
import SongsPage from './pages/Songs/Page'

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
