import logo from '@assets/logo_light.svg'
import { Outlet } from '@tanstack/react-router'

export default function AuthLayout() {
  return (
    <div className="absolute left-0 top-0 h-screen w-screen bg-black">
      <img
        src={logo}
        alt="OurPraise Logo"
        className="mx-auto my-9 block h-16"
      />
      <Outlet />
    </div>
  )
}
