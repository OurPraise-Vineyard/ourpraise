import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getRouteApi } from '@tanstack/react-router'

import logo from '~/assets/logo_light.svg'
import { login } from '~/backend/auth'
import Button from '~/components/Button'
import { SelectField, TextField } from '~/components/FormFields'
import MetaTitle from '~/components/MetaTitle'
import router, { RoutePath } from '~/router'
import {
  LocationValue,
  getLatestLocation,
  locations,
  setLocation
} from '~/utils/location'

type AuthSearchParams = {
  redirect: string
}

type LoginForm = {
  email: string
  password: string
  location: LocationValue
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

  const { register, handleSubmit } = useForm<LoginForm>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const location = getLatestLocation()

  const onSubmit = async ({ email, password, location }: LoginForm) => {
    setLoading(true)
    setLocation(location)
    if ((await login(email.toLowerCase(), password)).status === 'loggedIn') {
      router.history.push(search.redirect)
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  return (
    <div className="absolute left-0 top-0 h-screen w-screen bg-black">
      <MetaTitle title="Login" />
      <img
        src={logo}
        alt="OurPraise Logo"
        className="mx-auto my-9 block h-16"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mx-auto mt-32 flex w-96 max-w-full flex-grow animate-teleportIn flex-col gap-4 p-5"
      >
        <SelectField
          title="Church Location"
          options={locations}
          fieldProps={register('location', { required: true })}
          defaultValue={location}
          className="bg-white"
        />
        <TextField
          autoFocus
          title="Email"
          fieldProps={register('email', { required: true })}
          className="bg-white"
        />
        <TextField
          type="password"
          title="Password"
          fieldProps={register('password', { required: true })}
          className="bg-white"
        />
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {error && <p className="text-center text-red-500">{error}</p>}
      </form>
    </div>
  )
}
