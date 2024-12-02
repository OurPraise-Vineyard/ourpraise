import classNames from 'classnames'
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

import { Link, LinkComponentProps } from '@tanstack/react-router'

const colorSchemes = {
  default: 'bg-slate-200 text-black border border-slate-300 hover:bg-slate-300',
  primary: 'bg-blue-500 text-white border border-blue-400 hover:bg-blue-600',
  danger: 'bg-red-600 text-white border border-red-700 hover:bg-red-700',
  transparent:
    'bg-transparent border border-black text-black hover:bg-gray-100',
  disabled:
    'bg-gray-300 text-gray-500 border border-gray-300 cursor-not-allowed'
}

const buttonStyles =
  'cursor-pointer text-lg/none transition-all duration-200 ease-out py-2.5 px-5 rounded-full border-0 flex items-center text-center justify-center h-toolbar whitespace-nowrap'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof colorSchemes
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkComponentProps & {
    variant?: keyof typeof colorSchemes
    type: 'link'
  }

export default function Button({
  variant = 'default',
  type = 'button',
  disabled = false,
  className,
  ...props
}: ButtonProps | LinkProps) {
  const buttonClass = classNames(
    buttonStyles,
    colorSchemes[disabled ? 'disabled' : variant],
    className
  )

  if (type === 'link') {
    return (
      <Link
        className={classNames(buttonClass, 'decoration-none m-0')}
        disabled={disabled}
        {...(props as LinkProps)}
      />
    )
  }

  return (
    <button
      className={buttonClass}
      disabled={disabled}
      {...(props as ButtonProps)}
    />
  )
}
