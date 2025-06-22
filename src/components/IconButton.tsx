import classNames from 'classnames'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

import type { LinkComponentProps } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & {
    icon: string
    type: 'link'
  }

export default function IconButton({
  icon,
  className,
  type = 'button',
  ...props
}: ButtonProps | LinkProps) {
  const componentProps = {
    className: classNames(
      'h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent bg-center bg-no-repeat transition-colors duration-200 ease-out hover:bg-gray-100 print:hidden',
      className
    ),
    style: {
      backgroundSize: '20px 20px',
      backgroundImage: `url("${icon}")`
    },
    ...props
  }

  if (type === 'link') {
    return <Link {...(componentProps as LinkProps)} />
  }

  return <button type={type} {...(componentProps as ButtonProps)} />
}
