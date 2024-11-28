import classNames from 'classnames'
import React, { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

const colorSchemes = {
  default: 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-300',
  primary: 'bg-blue-500 text-white border border-blue-400 hover:bg-blue-600',
  danger: 'bg-red-600 text-white border border-red-700 hover:bg-red-700',
  transparent: 'bg-transparent border border-black text-black hover:bg-gray-100'
}

const buttonStyles =
  'cursor-pointer text-lg/none transition-all duration-200 ease-out py-2.5 px-5 rounded border-0 flex items-center text-center justify-center'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof colorSchemes
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: keyof typeof colorSchemes
  type: 'link'
  to: string
}

export default function Button({
  variant = 'default',
  type = 'button',
  className,
  ...props
}: ButtonProps | LinkProps) {
  const buttonClass = classNames(buttonStyles, colorSchemes[variant], className)

  if (type === 'link') {
    return (
      <Link
        className={classNames(buttonClass, 'decoration-none m-0')}
        {...(props as LinkProps)}
      />
    )
  }

  return <button className={buttonClass} {...(props as ButtonProps)} />
}
