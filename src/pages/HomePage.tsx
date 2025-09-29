import classNames from 'classnames'
import {
  Link,
  NavLink,
  type NavLinkRenderProps,
  Outlet,
  useSearchParams
} from 'react-router'

import plusIcon from '~/assets/plus.svg'
import NavSearchField from '~/components/NavSearchField'
import Page from '~/components/Page'
import { formatLink } from '~/utils/link-formatter'

function tabClassnameFunc({ isActive }: NavLinkRenderProps) {
  return classNames('tab', { 'tab-active': isActive })
}

export default function HomePage() {
  const [searchParams] = useSearchParams()
  function keepQuery(path: string) {
    return formatLink(path, { q: searchParams.get('q') })
  }

  return (
    <Page>
      <div className="flex w-full flex-row items-center gap-2">
        <div role="tablist" className="tabs tabs-border">
          <NavLink
            to={keepQuery('/events')}
            role="tab"
            className={tabClassnameFunc}
          >
            Events
          </NavLink>
          <NavLink
            to={keepQuery('/songs')}
            role="tab"
            className={tabClassnameFunc}
          >
            Songs
          </NavLink>
        </div>

        <div className="grow" />

        <ul className="menu menu-horizontal -mr-2 gap-2">
          <li>
            <NavSearchField />
          </li>
          <li>
            <details>
              <summary className="btn btn-primary">
                <img src={plusIcon} className="icon" />
                Create
              </summary>
              <ul className="bg-base-100 z-10 rounded-t-none p-2">
                <li>
                  <Link className="text-nowrap" to="/events/add">
                    New event
                  </Link>
                </li>
                <li>
                  <Link className="text-nowrap" to="/songs/add">
                    New song
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>

      <Outlet />
    </Page>
  )
}
