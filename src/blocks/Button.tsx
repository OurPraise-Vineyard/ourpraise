import classNames from 'classnames'
import React, { ButtonHTMLAttributes } from 'react'

const colorSchemes = {
  default: 'bg-gray-200 text-black border border-gray-300 hover:bg-gray-300',
  primary: 'bg-blue-500 text-white border border-blue-400 hover:bg-blue-600',
  danger: 'bg-red-600 text-white border border-red-700 hover:bg-red-700',
  transparent: 'bg-transparent border border-black text-black hover:bg-gray-100'
}

export type IButtonProps = {
  $buttonStyle?: keyof typeof colorSchemes
}

export default function Button({
  $buttonStyle = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  $buttonStyle?: keyof typeof colorSchemes
}) {
  const buttonClass = classNames(
    'cursor-pointer text-base transition-all duration-200 ease-out p-2.5 rounded border-0 m-0 mb-2 block',
    colorSchemes[$buttonStyle]
  )

  return <button className={buttonClass} {...props} />
}
