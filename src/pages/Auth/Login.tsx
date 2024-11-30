import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getRouteApi } from '@tanstack/react-router'

import { login } from '~/backend/auth'
import Button from '~/components/Button'
import { HookTextField as TextField } from '~/components/FormFields'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import router, { RoutePath } from '~/router'

type AuthSearchParams = {
  redirect: string
}

export function validateSearch(
  search: Record<string, unknown>
): AuthSearchParams {
  return {
    redirect: typeof search.redirect === 'string' ? search.redirect : '/events'
  }
}

export default function Login({ routePath }: { routePath: RoutePath }) {
  const search: AuthSearchParams = getRouteApi(routePath).useSearch()

  const { register, handleSubmit } = useForm<{
    email: string
    password: string
  }>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useDocumentTitle('Login')

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    if ((await login(email.toLowerCase(), password)).status === 'loggedIn') {
      router.history.push(search.redirect)
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mx-auto mt-32 flex w-96 max-w-full flex-grow animate-teleportIn flex-col gap-4 p-5"
    >
      <TextField
        autoFocus
        title="Email"
        fieldProps={register('email', { required: true })}
      />
      <TextField
        type="password"
        title="Password"
        fieldProps={register('password', { required: true })}
      />
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {error && <p className="text-center text-red-500">{error}</p>}
    </form>
  )
}
