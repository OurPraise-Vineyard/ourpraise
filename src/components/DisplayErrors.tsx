import classNames from 'classnames'
import useErrors from '~/hooks/useErrors'

export default function DisplayErrors() {
  const { errors } = useErrors()

  return (
    <>
      {errors.map((error, index) => (
        <div
          className={classNames(
            'z-50items-center fixed left-1/2 flex h-10 -translate-x-1/2 animate-fadeIn justify-center rounded bg-red-500 p-2.5 text-white transition-all duration-200 ease-out',
            {
              'opacity-0': error.removed,
              'h-0': error.removed
            }
          )}
          key={error.id}
          style={{ bottom: index * 48 + 8 }}
        >
          {error.message}
        </div>
      ))}
    </>
  )
}
