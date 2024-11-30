import classNames from 'classnames'

export default function Page({
  children,
  noAnimation = false
}: {
  noAnimation?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={classNames(
        'mx-auto w-page max-w-full p-5',
        !noAnimation && 'animate-fadeIn'
      )}
    >
      {children}
    </div>
  )
}
