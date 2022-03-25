import { signIn } from 'api/auth'
import Button from 'Login/Button'
import Container from 'Login/Container'
import Form from 'Login/Form'
import Logo from 'Login/Logo'
import TextField from 'Login/TextField'
import React, { useState } from 'react'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
      await signIn(email, password)
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
