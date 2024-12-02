import classNames from 'classnames'

export default function Page({
  children,
  noAnimation = false,
  className
}: {
  noAnimation?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={classNames(
        'mx-auto w-full max-w-full p-5 lg:w-page',
        !noAnimation && 'animate-fadeIn',
        className
      )}
    >
      {children}
    </div>
  )
}
