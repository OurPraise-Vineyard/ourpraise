import React from 'react'

import ErrorSnackbar from '@blocks/ErrorSnackbar'

import useErrors from '@hooks/useErrors'

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
