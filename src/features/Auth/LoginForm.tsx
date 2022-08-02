import { useAppDispatch, useDocumentTitle } from '@utils/hooks'
import Button from '@features/Auth/Blocks/Button'
import Form from '@features/Auth/Blocks/Form'
import TextField from '@features/Auth/Blocks/TextField'
import { signIn } from '@features/Auth/authSlice'
import React, { useState } from 'react'
import ModeLink from '@features/Auth/Blocks/ModeLink'
import { pushError } from '@utils/errorSlice'

export default function LoginForm () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(signIn({ email, password })).unwrap()
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField autoFocus onChange={handleChange('email')} value={email} name="email" title="Email"></TextField>
      <TextField onChange={handleChange('password')} value={password} name="password" password title="Password"></TextField>
      <Button type="submit">Login</Button>
      <ModeLink to="/register">Not a member yet? Sign up today!</ModeLink>
    </Form>
  )
}
