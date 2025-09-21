import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'

import logo from '~/assets/logo_light.svg'
import { getAuthState, logout } from '~/backend/auth'
import type { IUser } from '~/types/backend'
import { getLatestLocationLabel } from '~/utils/location'

import { usePopUpMenu } from './PopUpMenu'

const navLinkStyles =
  'border-b text-white hover:border-b-white border-b-transparent'
const linkActiveStyles = 'border-b-white'

export default function Nav() {
  const [user, setUser] = useState<IUser>()
  const menu = usePopUpMenu()
  const location = getLatestLocationLabel()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async function () {
      const user = (await getAuthState()).user
      if (user) {
        setUser(user)
      }
    })()
  }, [])

  const openMenu = (e: React.MouseEvent<HTMLDivElement>) =>
    menu.open(e, () => [
      {
        label: 'Sign out',
        onClick: async () => {
          await logout()
          navigate('/login')
        }
      }
    ])

  return (
    <div className="animate-fadeIn bg-black shadow-md print:hidden">
      <div className="lg:w-page mx-auto flex w-full items-center p-5">
        <div className="grow">
          <img
            src={logo}
            alt="OurPraise Logo"
            className="col-start-1 mb-1 h-10"
          />
          <ul className="flex gap-5">
            <NavLink
              className={({ isActive }) =>
                `${navLinkStyles} ${isActive ? linkActiveStyles : ''}`
              }
              to="/events"
            >
              Events
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `${navLinkStyles} ${isActive ? linkActiveStyles : ''}`
              }
              to="/songs"
            >
              Songs
            </NavLink>
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
  )
}
