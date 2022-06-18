import { useAppDispatch } from '@hooks'
import Button from '@features/Auth/Blocks/Button'
import Form from '@features/Auth/Blocks/Form'
import TextField from '@features/Auth/Blocks/TextField'
import { createAccount } from '@features/Auth/authSlice'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { pushError } from '@utils/errorSlice'
import ModeLink from '@features/Auth/Blocks/ModeLink'

function safeMatchSearch (key) {
  const reg = new RegExp(`\\?.*${key}=([\\w\\d.@]*).*$`)
  console.log(reg)
  const match = window.location.search
    .match(reg)

  if (match) {
    return match[1]
  }

  return ''
}

export default function RegisterForm () {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [isInvite, setIsInvite] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (window.location.search) {
      try {
        const email = safeMatchSearch('email')
        const name = safeMatchSearch('name')

        setEmail(email)
        setName(name)
        setIsInvite(true)
      } catch (err) {
        console.log('No email provided')
      }
    }
  }, [])

  const handleChange = name => e => {
    switch (name) {
      case 'email':
        return setEmail(e.target.value)
      case 'password':
        return setPassword(e.target.value)
      case 'repeatPassword':
        return setRepeatPassword(e.target.value)
      case 'name':
        return setName(e.target.value)
      default:
        break
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== repeatPassword) {
      dispatch(pushError('Passwords must match'))
      return
    }

    try {
      await dispatch(createAccount({ email, password, displayName: name }))
      navigate('/')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField autoFocus onChange={handleChange('name')} value={name} name="name" title="Name"></TextField>
      {isInvite
        ? <TextField disabled value={email} name="email" title="Email"></TextField>
        : <TextField onChange={handleChange('email')} value={email} name="email" title="Email"></TextField>}
      <TextField onChange={handleChange('password')} value={password} name="password" password title="Password"></TextField>
      <TextField onChange={handleChange('repeatPassword')} value={repeatPassword} name="repeatPassword" password title="Repeat password"></TextField>
      <Button type="submit">Register</Button>
      <ModeLink to="/">Already a member? Login instead</ModeLink>
    </Form>
  )
}
