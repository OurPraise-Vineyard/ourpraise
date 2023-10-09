import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import Container from '@components/AuthContainer'
import Form from '@components/AuthFormWrapper'
import Logo from '@components/AuthLogo'
import SaveButton from '@components/form/SaveButton'
import TextField from '@components/form/TextField'
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

      if (await createUser(email, password, name)) {
        navigate('/')
      } else {
        setLoading(false)
      }
    } else {
      if (!(await signIn(email, password))) {
        setLoading(false)
      }
    }
  }

  return (
    <Container>
      <Logo />
      <Form onSubmit={handleSubmit}>
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
              password
              title="Password"
            />
            <TextField
              onChange={value => setField('repeatPassword', value)}
              value={repeatPassword}
              name="repeatPassword"
              password
              title="Repeat password"
            />
            <SaveButton type="submit">
              {loading ? 'Please wait...' : 'Register'}
            </SaveButton>
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
              password
              title="Password"
            />
            <SaveButton type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </SaveButton>
          </>
        )}
      </Form>
    </Container>
  )
}
