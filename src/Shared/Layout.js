import { Outlet } from 'react-router-dom'
import Nav from 'Shared/Nav'
import Page from 'Shared/Page'

export default function Layout () {
  return (
    <main>
      <Nav />
      <Page>
        <Outlet />
      </Page>
    </main>
  )
}
