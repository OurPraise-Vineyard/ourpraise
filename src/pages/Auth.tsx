import React from 'react'
import { useLocation } from 'react-router-dom'

import Container from '@features/Auth/Blocks/Container'
import FadeContainer from '@features/Auth/Blocks/FadeContainer'
import Logo from '@features/Auth/Blocks/Logo'
import LoginForm from '@features/Auth/LoginForm'
import RegisterForm from '@features/Auth/RegisterForm'

export default function Auth() {
  const isRegister = useLocation().pathname.startsWith('/register')

  return (
    <Container>
      <FadeContainer>
        <Logo />
        {isRegister ? <RegisterForm /> : <LoginForm />}
      </FadeContainer>
    </Container>
  )
}
