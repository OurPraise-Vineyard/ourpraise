import React, { Outlet, useLocation } from 'react-router-dom'
import Nav from '@features/Shared/Nav'
import Page from '@features/Shared/Page'

export default function Layout ({ wide = false }) {
  const { pathname } = useLocation()

  return (
    <main>
      <Nav wide={wide} />
      <Page wide={wide} key={pathname}>
        <Outlet />
      </Page>
    </main>
  )
}
