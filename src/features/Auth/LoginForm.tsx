import React, { useState } from 'react'

import Button from '@features/Auth/Blocks/Button'
import Form from '@features/Auth/Blocks/Form'
import TextField from '@features/Auth/Blocks/TextField'
import { useAppDispatch } from '@hooks/state'
import { useDocumentTitle } from '@hooks/useDocumentTitle'
import { signIn } from '@state/authSlice'
import { pushError } from '@state/errorSlice'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  useDocumentTitle('Login')

  const handleChange = name => e => {
    switch (name) {
      case 'email':
        return setEmail(e.target.value)
      case 'password':
        return setPassword(e.target.value)
      default:
        break
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      await dispatch(signIn({ email, password })).unwrap()
    } catch (err) {
      setLoading(false)
      dispatch(pushError(err))
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        autoFocus
        onChange={handleChange('email')}
        value={email}
        name="email"
        title="Email"
      ></TextField>
      <TextField
        onChange={handleChange('password')}
        value={password}
        name="password"
        password
        title="Password"
      ></TextField>
      <Button type="submit">{loading ? 'Logging in...' : 'Login'}</Button>
    </Form>
  )
}
