import React, { Outlet, useLocation } from 'react-router-dom'

import Nav from '@components/Nav'

import Page from '@blocks/Page'

export default function Layout({ noFadeIn = false }) {
  const { pathname } = useLocation()

  return (
    <main>
      <Nav />
      <Page $noFadeIn={noFadeIn} key={noFadeIn ? undefined : pathname}>
        <Outlet />
      </Page>
    </main>
  )
}
