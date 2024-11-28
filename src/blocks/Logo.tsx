import React from 'react'

import logo from '@assets/logo_light.svg'

export default function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="OurPraise Logo" className={className} />
}
