import classNames from 'classnames'

export default function Page({
  children,
  noAnimation = true,
  className
}: {
  noAnimation?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={classNames(
        'lg:w-page mx-auto w-full max-w-full p-5',
        !noAnimation && 'animate-fadeIn',
        className
      )}
    >
      {children}
    </div>
  )
}
