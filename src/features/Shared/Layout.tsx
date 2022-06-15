import React, { Outlet } from 'react-router-dom'
import Nav from '@features/Shared/Nav'
import Page from '@features/Shared/Page'

export default function Layout ({ wide = false }) {
  return (
    <main>
      <Nav wide={wide} />
      <Page wide={wide}>
        <Outlet />
      </Page>
    </main>
  )
}
