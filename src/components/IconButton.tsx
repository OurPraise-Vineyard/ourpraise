import classNames from 'classnames'
import React, { ButtonHTMLAttributes } from 'react'

export default function IconButton({
  icon,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: string }) {
  return (
    <button
      className={classNames(
        'h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent bg-center bg-no-repeat transition-colors duration-200 ease-out hover:bg-gray-100 print:hidden',
        className
      )}
      style={{
        backgroundSize: '20px 20px',
        backgroundImage: `url(${icon})`
      }}
      {...props}
    />
  )
}
