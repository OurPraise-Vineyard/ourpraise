import { useAppDispatch } from '@hooks'
import Button from '@features/Auth/Blocks/Button'
import Container from '@features/Auth/Blocks/Container'
import Form from '@features/Auth/Blocks/Form'
import Logo from '@features/Auth/Blocks/Logo'
import TextField from '@features/Auth/Blocks/TextField'
import { signIn } from '@features/Auth/authSlice'
import React, { useState } from 'react'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()

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
      await dispatch(signIn({ email, password }))
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Container>
      <Logo />
      <Form onSubmit={handleSubmit}>
        <TextField onChange={handleChange('email')} value={email} name="email" title="Email"></TextField>
        <TextField onChange={handleChange('password')} value={password} name="password" password title="Password"></TextField>
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  )
}
