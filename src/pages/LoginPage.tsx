import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'

import logo from '~/assets/logo_light.svg'
import { login } from '~/backend/auth'
import Button from '~/components/Button'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import { SelectField, TextField } from '~/components/FormFields'
import MetaTitle from '~/components/MetaTitle'
import {
  type LocationValue,
  getLatestLocation,
  locations,
  setLocation
} from '~/utils/location'

type LoginForm = {
  email: string
  password: string
  location: LocationValue
}

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { register, handleSubmit } = useForm<LoginForm>()
  const [loading, setLoading] = useState(false)
  const location = getLatestLocation()
  const errors = useErrorPopUp()

  const onSubmit = async ({ email, password, location }: LoginForm) => {
    setLoading(true)
    setLocation(location)
    try {
      await login(email.toLowerCase(), password)
      const redirect = searchParams.get('redirect')
      if (redirect) {
        navigate(redirect)
      } else {
        navigate('/events')
      }
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
