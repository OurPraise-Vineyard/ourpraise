import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import logo from '~/assets/logo_dark.svg'
import userIcon from '~/assets/user.svg'
import { getAuthState, logout } from '~/backend/auth'
import type { IUser } from '~/types'

export default function Nav() {
  const [user, setUser] = useState<IUser>()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async function () {
      const user = (await getAuthState()).user
      if (user) {
        setUser(user)
      }
    })()
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar bg-base-100 sticky top-0 z-10 px-4 shadow-sm print:hidden">
      <div className="flex-1">
        <img
          src={logo}
          alt="OurPraise Logo"
          className="svg col-start-1 mb-1 h-10"
        />
      </div>

      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-7 rounded-full">
            <img alt="Account" src={userIcon} className="icon" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <p className="menu-title">
            Logged in as: {user ? user.displayName || user.email : ''}
          </p>
          <li>
            <a>Profile</a>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
