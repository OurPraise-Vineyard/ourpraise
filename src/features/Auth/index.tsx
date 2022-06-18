import Container from '@features/Auth/Blocks/Container'
import Logo from '@features/Auth/Blocks/Logo'
import React from 'react'
import FadeContainer from '@features/Auth/Blocks/FadeContainer'
import { useLocation } from 'react-router-dom'
import RegisterForm from '@features/Auth/RegisterForm'
import LoginForm from '@features/Auth/LoginForm'

export default function Auth () {
  const isRegister = useLocation().pathname.startsWith('/register')

  return (
    <Container>
      <FadeContainer>
        <Logo />
        {isRegister
          ? (
            <RegisterForm />
          )
          : (
            <LoginForm />
          )}
      </FadeContainer>
    </Container>
  )
}
