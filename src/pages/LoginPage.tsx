import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'

import logo from '~/assets/logo_light.svg'
import { login } from '~/backend/auth'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import {
  type LocationValue,
  getLatestLocation,
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
    <div className="absolute top-0 right-0 bottom-0 left-0 bg-black">
      <MetaTitle title="Login" />
      <img
        src={logo}
        alt="OurPraise Logo"
        className="svg mx-auto my-9 block h-16"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="animate-teleportIn relative mx-auto mt-32 flex w-96 max-w-full grow flex-col gap-4 p-5"
      >
        <input
          autoFocus
          placeholder="Email"
          {...register('email', { required: true })}
          className="input w-full"
        />
        <input
          type="password"
          placeholder="Password"
          required
          {...register('password', { required: true })}
          className="input w-full"
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
