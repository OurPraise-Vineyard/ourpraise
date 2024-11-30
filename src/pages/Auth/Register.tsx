import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { getRouteApi, useLocation } from '@tanstack/react-router'

import Button from '~/components/Button'
import { HookTextField as TextField } from '~/components/FormFields'
import { useDocumentTitle } from '~/hooks/useDocumentTitle'
import { RoutePath } from '~/router'

type AuthSearchParams = {
  email: string
}

type RegisterForm = {
  email: string
  password: string
  repeatPassword: string
  name: string
}

export function validateSearch(
  search: Record<string, unknown>
): AuthSearchParams {
  return {
    email: typeof search.email === 'string' ? search.email : ''
  }
}

export default function Register({ routePath }: { routePath: RoutePath }) {
  const { useNavigate, useSearch } = getRouteApi(routePath)
  const search: AuthSearchParams = useSearch()

  const { register, handleSubmit } = useForm<RegisterForm>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  useDocumentTitle('Register')

  const onSubmit = async ({ password, repeatPassword }: RegisterForm) => {
    setLoading(true)
    if (password !== repeatPassword) {
      setError('Passwords must match')
      return
    }

    // if (await createUser(email.toLowerCase(), password, name)) {
    //   navigate({
    //     to: '/events'
    //   })
    // } else {
    //   setLoading(false)
    // }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mx-auto mt-32 flex w-96 max-w-full flex-grow animate-teleportIn flex-col gap-4 p-5"
    >
      <TextField autoFocus title="Name" fieldProps={register('name')} />
      <TextField
        disabled={search.email !== ''}
        defaultValue={search.email}
        title="Email"
        fieldProps={register('email', { required: 'Email is required' })}
      />
      <TextField
        type="password"
        title="Password"
        fieldProps={register('password', { required: 'Password is required' })}
      />
      <TextField
        type="password"
        title="Repeat password"
        fieldProps={register('repeatPassword', {
          required: 'Please repeat your password'
        })}
      />
      <Button variant="primary" type="submit">
        {loading ? 'Please wait...' : 'Register'}
      </Button>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  )
}
