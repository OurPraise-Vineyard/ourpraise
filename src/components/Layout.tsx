import classNames from 'classnames'
import React, { Outlet, useLocation } from 'react-router'

import Nav from '@components/Nav'

export default function Layout({ noFadeIn = false }) {
  const { pathname } = useLocation()

  return (
    <main>
      <Nav />
      <div
        className={classNames(
          'w-page mx-auto max-w-full p-5',
          !noFadeIn && 'animate-fadeIn'
        )}
        key={noFadeIn ? undefined : pathname}
      >
        <Outlet />
      </div>
    </main>
  )
}
