import { RoutePath } from '@router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import Button from '@components/Button'
import { TextField } from '@components/FormFields'

import useAuthForm from '@hooks/forms/useAuthForm'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'
import { getRouteApi, useLocation } from '@tanstack/react-router'

type AuthSearchParams = {
  email: string
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

  const { register, handleSubmit } = useForm()
  const isRegister = useLocation().pathname.startsWith('/register')
  const [{ email, name, password, repeatPassword, isInvite }, setField] =
    useAuthForm()
  const [loading, setLoading] = useState(false)
  const { pushError } = useErrors()
  const navigate = useNavigate()
  useDocumentTitle(isRegister ? 'Register' : 'Login')

  useEffect(() => {
    if (isRegister && window.location.search) {
      const email = search.email

      if (email) {
        setField('email', email)
        setField('isInvite', true)
      }
    }
  }, [setField, isRegister])

  const onSubmit = async data => {
    console.log(data)

    // e.preventDefault()
    // setLoading(true)
    // if (isRegister) {
    //   if (password !== repeatPassword) {
    //     pushError('Passwords must match')
    //     return
    //   }

    //   // if (await createUser(email.toLowerCase(), password, name)) {
    //   //   navigate({
    //   //     to: '/'
    //   //   })
    //   // } else {
    //   //   setLoading(false)
    //   // }
    // } else {
    //   if (await login(email.toLowerCase(), password)) {
    //     router.history.push(search.redirect)
    //   } else {
    //     setLoading(false)
    //   }
    // }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mx-auto mt-32 flex w-96 max-w-full flex-grow animate-teleportIn flex-col gap-4 p-5"
    >
      <TextField
        autoFocus
        onChange={value => setField('name', value)}
        value={name}
        name="name"
        title="Name"
      />
      <TextField
        disabled={isInvite}
        value={email}
        name="email"
        title="Email"
        onChange={value => setField('email', value)}
      />
      <TextField
        onChange={value => setField('password', value)}
        value={password}
        name="password"
        type="password"
        title="Password"
      />
      <TextField
        onChange={value => setField('repeatPassword', value)}
        value={repeatPassword}
        name="repeatPassword"
        type="password"
        title="Repeat password"
      />
      <Button variant="primary" type="submit">
        {loading ? 'Please wait...' : 'Register'}
      </Button>
    </form>
  )
}
