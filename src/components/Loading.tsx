import classNames from 'classnames'

export default function Loading({ fullscreen }: { fullscreen?: boolean }) {
  return (
    <div
      className={classNames(
        'flex items-center justify-center',
        fullscreen ? 'h-screen' : 'h-36'
      )}
    >
      <div className="box-border inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-b-transparent"></div>
    </div>
  )
}
