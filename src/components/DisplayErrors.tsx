import ErrorSnackbar from 'blocks/ErrorSnackbar'
import useErrors from 'hooks/useErrors'
import React from 'react'

export default function DisplayErrors() {
  const { errors } = useErrors()

  return (
    <>
      {errors.map((error, index) => (
        <ErrorSnackbar
          key={error.id}
          style={{ bottom: index * 48 + 8 }}
          $unmounted={!!error.removed}
        >
          {error.message}
        </ErrorSnackbar>
      ))}
    </>
  )
}
