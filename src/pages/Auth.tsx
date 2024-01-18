import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import TextField from '@components/form/TextField'

import Container from '@blocks/AuthContainer'
import Form from '@blocks/AuthFormWrapper'
import Logo from '@blocks/AuthLogo'
import Button from '@blocks/Button'

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
            <Button $buttonStyle="primary" type="submit">
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
              password
              title="Password"
            />
            <Button $buttonStyle="primary" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </>
        )}
      </Form>
    </Container>
  )
}
