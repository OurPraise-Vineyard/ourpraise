import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import logo from '@assets/logo_light.png'
import Page from '@features/Shared/Page'
import { Link } from 'react-router-dom'
import LinkBase from '@features/Shared/LinkBase'
import { useAppSelector } from '@hooks'
import UserModal from '@features/Auth/UserModal'

const Container = styled.nav`
  background-color: black;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
`

const Logo = styled.img.attrs({
  src: logo,
  alt: 'OurPraise logo',
})`
  height: 40px;
`

const Username = styled.p<{ org: string }>`
  padding: 0;
  font-size: 20px;
  color: white;
  cursor: pointer;
  grid-area: username;
  justify-self: end;
  margin: 0;
  white-space: nowrap;
  text-align: right;

  &::after {
    content: "${props => props.org}";
    display: block;
    font-size: 0.88em;
    color: #bbb;
  }
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
  const org = useAppSelector(state => state.auth.organisation)
  const orgName = org ? org.name : ''
  const [showUser, setShowUser] = useState(false)

  return (
    <Container>
      <UserModal show={showUser} onClose={() => setShowUser(false)} />
      <Wrapper wide={wide}>
        <HomeLink to="/home">
          <Logo />
        </HomeLink>
        <Username onClick={() => setShowUser(true)} org={orgName}>{user ? user.displayName || user.email : ''}</Username>
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
