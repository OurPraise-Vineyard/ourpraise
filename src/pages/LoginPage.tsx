import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { getRouteApi } from '@tanstack/react-router'

import logo from '~/assets/logo_light.svg'
import { login } from '~/backend/auth'
import Button from '~/components/Button'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import { SelectField, TextField } from '~/components/FormFields'
import MetaTitle from '~/components/MetaTitle'
import router, { type RoutePath } from '~/router'
import {
  type LocationValue,
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
  const location = getLatestLocation()
  const errors = useErrorPopUp()

  const onSubmit = async ({ email, password, location }: LoginForm) => {
    setLoading(true)
    setLocation(location)
    try {
      await login(email.toLowerCase(), password)
      router.history.push(search.redirect)
    } catch (error: any) {
      errors.show(error)
      setLoading(false)
    }
  }

  return (
    <div className="absolute top-0 left-0 h-screen w-screen bg-black">
      <MetaTitle title="Login" />
      <img
        src={logo}
        alt="OurPraise Logo"
        className="mx-auto my-9 block h-16"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="animate-teleportIn relative mx-auto mt-32 flex w-96 max-w-full grow flex-col gap-4 p-5"
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
      </form>
    </div>
  )
}
