import { useMemo } from 'react'

import { Link } from '@tanstack/react-router'

import logo from '~/assets/logo_light.svg'
import { getAuthState, logout } from '~/backend/auth'
import ContextMenu from '~/components/ContextMenu'
import useContextMenuState from '~/hooks/useContextMenuState'
import router from '~/router'

const navLinkStyles =
  'border-b text-white hover:border-b-white border-b-transparent'
const linkActiveStyles = 'border-b-white'

export default function Nav() {
  const { user } = getAuthState()
  const menu = useContextMenuState()

  const menuItems = useMemo(
    () => [
      {
        label: 'Sign out',
        onClick: async () => {
          await logout()
          router.history.push('/login')
        }
      }
    ],
    []
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
        <div className="mx-auto flex w-page items-center p-5">
          <div className="flex-grow">
            <img
              src={logo}
              alt="OurPraise Logo"
              className="col-start-1 mb-1 h-10"
            />
            <ul className="flex gap-5">
              <Link
                className={navLinkStyles}
                activeProps={{ className: linkActiveStyles }}
                to="/events"
              >
                Events
              </Link>
              <Link
                className={navLinkStyles}
                activeProps={{ className: linkActiveStyles }}
                to="/songs"
              >
                Songs
              </Link>
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
