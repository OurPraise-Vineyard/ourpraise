import { useMemo } from 'react';
import { NavLink } from 'react-router'

import ContextMenu from '@components/ContextMenu'

import logo from '@assets/logo_light.svg'
import useAuth from '@hooks/useAuth'
import useContextMenuState from '@hooks/useContextMenuState'

const navLinkStyles = ({ isActive }) =>
  `border-b text-white hover:border-b-white ${isActive ? 'border-b-white' : 'border-b-transparent'}`

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
      <div className="bg-black shadow-md print:hidden">
        <div className="w-page mx-auto flex items-center p-5">
          <div className="flex-grow">
            <img
              src={logo}
              alt="OurPraise Logo"
              className="col-start-1 mb-1 h-10"
            />
            <ul className="flex gap-5">
              <NavLink className={navLinkStyles} to="/events">
                Events
              </NavLink>
              <NavLink className={navLinkStyles} to="/songs">
                Songs
              </NavLink>
            </ul>
          </div>
          <p
            className="cursor-pointer text-lg text-white"
            onClick={menu.onOpen}
          >
            {user ? user.displayName || user.email : ''}
          </p>
        </div>
      </div>
    </>
  )
}
