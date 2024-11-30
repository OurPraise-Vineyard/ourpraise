import router, { RoutePath } from '@router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from '@components/Button'
import { HookTextField as TextField } from '@components/FormFields'

import { login } from '@backend/auth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { getRouteApi } from '@tanstack/react-router'

type AuthSearchParams = {
  redirect: string
}

export function validateSearch(
  search: Record<string, unknown>
): AuthSearchParams {
  return {
    redirect: typeof search.redirect === 'string' ? search.redirect : '/'
  }
}

export default function Login({ routePath }: { routePath: RoutePath }) {
  const search: AuthSearchParams = getRouteApi(routePath).useSearch()

  const { register, handleSubmit } = useForm<{
    email: string
    password: string
  }>()
  const [loading, setLoading] = useState(false)
  useDocumentTitle('Login')

  const onSubmit = async ({ email, password }) => {
    setLoading(true)
    if (await login(email.toLowerCase(), password)) {
      router.history.push(search.redirect)
    } else {
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
    </form>
  )
}
