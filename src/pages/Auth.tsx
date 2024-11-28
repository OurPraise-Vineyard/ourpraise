import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Button from '@components/Button'
import { TextField } from '@components/FormFields'

import logo from '@assets/logo_light.svg'
import useAuthForm from '@hooks/forms/useAuthForm'
import useAuth from '@hooks/useAuth'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import useErrors from '@hooks/useErrors'
import getSearchParam from '@utils/getSearchParam'

export default function Auth() {
  const isRegister = useLocation().pathname.startsWith('/register')
  const [{ email, name, password, repeatPassword, isInvite }, setField] =
    useAuthForm()
  const [loading, setLoading] = useState(false)
  const { createUser, signIn } = useAuth()
  const { pushError } = useErrors()
  const navigate = useNavigate()
  useDocumentTitle(isRegister ? 'Register' : 'Login')

  useEffect(() => {
    if (isRegister && window.location.search) {
      const email = getSearchParam('email')

      if (email) {
        setField('email', email)
        setField('isInvite', true)
      }
    }
  }, [setField, isRegister])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    if (isRegister) {
      if (password !== repeatPassword) {
        pushError('Passwords must match')
        return
      }

      if (await createUser(email.toLowerCase(), password, name)) {
        navigate('/')
      } else {
        setLoading(false)
      }
    } else {
      if (!(await signIn(email.toLowerCase(), password))) {
        setLoading(false)
      }
    }
  }

  return (
    <div className="absolute left-0 top-0 h-screen w-screen bg-black">
      <img
        src={logo}
        alt="OurPraise Logo"
        className="mx-auto my-9 block h-16"
      />
      <form
        onSubmit={handleSubmit}
        className="animate-teleportIn relative mx-auto mt-32 flex w-96 max-w-full flex-grow flex-col gap-4 p-5"
      >
        {isRegister ? (
          <>
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
          </>
        ) : (
          <>
            <TextField
              autoFocus
              onChange={value => setField('email', value)}
              value={email}
              name="email"
              title="Email"
            />
            <TextField
              onChange={value => setField('password', value)}
              value={password}
              name="password"
              type="password"
              title="Password"
            />
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </>
        )}
      </form>
    </div>
  )
}
