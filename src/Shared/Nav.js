import React, { useState } from 'react'
import styled from 'styled-components'
import logo from 'assets/logo.svg'
import Page from 'Shared/Page'
import { Link } from 'react-router-dom'
import { observeAuthState, signOut } from 'api/auth'

const Container = styled.nav`
  background-color: black;
  height: 100px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
`

const Logo = styled.img.attrs({
  src: logo,
  alt: 'Songdriver logo'
})`
  height: 40px;
`

const Username = styled.p`
  padding: 0;
  font-size: 20px;
  color: white;
  cursor: pointer;
`

const Wrapper = styled(Page)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`

export default function Nav () {
  const [user, setUser] = useState(null)
  observeAuthState(setUser)

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      signOut()
    }
  }

  return (
    <Container>
      <Wrapper>
        <Link to="/home">
          <Logo />
        </Link>
        <Username onClick={handleLogout}>{user ? (user.displayName || user.email) : ''}</Username>
      </Wrapper>
    </Container>
  )
}
