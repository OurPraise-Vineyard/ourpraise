import Page from 'blocks/Page'
import Nav from 'components/Nav'
import React, { Outlet, useLocation } from 'react-router-dom'

export default function Layout({ noFadeIn = false }) {
  const { pathname } = useLocation()

  return (
    <main>
      <Nav />
      <Page noFadeIn={noFadeIn} key={noFadeIn ? undefined : pathname}>
        <Outlet />
      </Page>
    </main>
  )
}
