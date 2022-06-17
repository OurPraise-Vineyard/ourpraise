import React from 'react'
import styled, { css } from 'styled-components'
import logo from '@assets/logo_light.png'
import Page from '@features/Shared/Page'
import { Link } from 'react-router-dom'
import LinkBase from '@features/Shared/LinkBase'
import { useAppDispatch, useAppSelector } from '@hooks'
import { signOut } from '@features/Auth/authSlice'

const Container = styled.nav`
  background-color: black;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
`

const Logo = styled.img.attrs({
  src: logo,
  alt: 'Besyng logo',
})`
  height: 40px;
`

const Username = styled.p`
  padding: 0;
  font-size: 20px;
  color: white;
  cursor: pointer;
  grid-area: username;
  justify-self: end;
  margin: 0;
  white-space: nowrap;
`

const Wrapper = styled(Page)`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: min-content min-content;
  grid-template-areas: 'logo username' 'links username';
  align-items: center;
  height: 100%;

  ${props =>
    props.wide &&
    css`
      width: auto;
    `}
`

const Links = styled.div`
  display: flex;
  grid-area: links;

  > a {
    font-size: 18px;
    color: white;
    text-decoration: none;
    margin-right: 20px;
  }
`

const HomeLink = styled(Link)`
  grid-area: logo;
`

export default function Nav({ wide = false }) {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      dispatch(signOut())
    }
  }

  return (
    <Container>
      <Wrapper wide={wide}>
        <HomeLink to="/home">
          <Logo />
        </HomeLink>
        <Username onClick={handleLogout}>{user ? user.displayName || user.email : ''}</Username>
        <Links>
          <LinkBase color="white" to="/home">
            Home
          </LinkBase>
          <LinkBase color="white" to="/songs">
            Songs
          </LinkBase>
          <LinkBase color="white" to="/events">
            Events
          </LinkBase>
        </Links>
      </Wrapper>
    </Container>
  )
}
