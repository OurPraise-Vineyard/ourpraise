import React, { useMemo } from 'react'

import ContextMenu from '@components/ContextMenu'

import NavContainer from '@blocks/NavContainer'
import NavContent from '@blocks/NavContent'
import NavLogo from '@blocks/NavLogo'
import NavMenu from '@blocks/NavMenu'
import NavMenuItem from '@blocks/NavMenuItem'
import NavUsername from '@blocks/NavUsername'

import useAuth from '@hooks/useAuth'
import useContextMenuState from '@hooks/useContextMenuState'

export default function Nav() {
  const { user } = useAuth()
  const menu = useContextMenuState()
  const { signOut } = useAuth()

  const menuItems = useMemo(
    () => [
      {
        label: 'Sign out',
        onClick: signOut
      }
    ],
    [signOut]
  )

  return (
    <>
      {menu.show && (
        <ContextMenu
          items={menuItems}
          top={menu.top}
          left={menu.left}
          onClose={menu.onClose}
        />
      )}
      <NavContainer>
        <NavContent>
          <NavLogo />
          <NavUsername onClick={menu.onOpen}>
            {user ? user.displayName || user.email : ''}
          </NavUsername>
          <NavMenu>
            <NavMenuItem to="/events">Events</NavMenuItem>
            <NavMenuItem to="/songs">Songs</NavMenuItem>
          </NavMenu>
        </NavContent>
      </NavContainer>
    </>
  )
}
