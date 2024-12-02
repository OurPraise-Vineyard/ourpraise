import React, { useMemo } from 'react'

import { Link } from '@tanstack/react-router'

import logo from '~/assets/logo_light.svg'
import { getAuthState, logout } from '~/backend/auth'
import router from '~/router'
import { getLatestLocationLabel } from '~/utils/location'

import { usePopUpMenu } from './PopUpMenu'

const navLinkStyles =
  'border-b text-white hover:border-b-white border-b-transparent'
const linkActiveStyles = 'border-b-white'

export default function Nav() {
  const { user } = getAuthState()
  const menu = usePopUpMenu()
  const location = getLatestLocationLabel()

  const openMenu = (e: React.MouseEvent<HTMLDivElement>) =>
    menu.open(e, () => [
      {
        label: 'Sign out',
        onClick: async () => {
          await logout()
          router.history.push('/login')
        }
      }
    ])

  return (
    <>
      <div className="bg-black shadow-md print:hidden">
        <div className="mx-auto flex w-full items-center p-5 lg:w-page">
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
          <div onClick={openMenu} className="cursor-pointer text-right">
            <p className="text-lg text-white">
              {user ? user.displayName || user.email : ''}
            </p>
            <p className="text-md text-gray-400">{location}</p>
          </div>
        </div>
      </div>
    </>
  )
}
