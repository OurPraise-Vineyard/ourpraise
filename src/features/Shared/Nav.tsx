import React, { useState } from 'react'
import styled from 'styled-components'
import logo from '@assets/logo_light.svg'
import Page from '@features/Shared/Page'
import { Link } from 'react-router-dom'
import LinkBase from '@features/Shared/LinkBase'
import { useAppSelector } from '@utils/hooks'
import UserOrg from '@features/Auth/UserOrg'
import AppTheme from '@styles/AppTheme'

const Container = styled.nav`
  background-color: ${AppTheme.colors.navBackground};
  box-shadow: ${AppTheme.boxShadow};
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
  color: ${AppTheme.colors.navText};
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
    color: ${AppTheme.colors.navTextFaded};
  }
`

const Wrapper = styled(Page)`
  display: grid;
  grid-template-columns: 1fr min-content;
  grid-template-rows: min-content min-content;
  grid-template-areas: 'logo username' 'links username';
  align-items: center;
  height: 100%;
`

const Links = styled.div`
  display: flex;
  grid-area: links;

  > a {
    font-size: 18px;
    color: ${AppTheme.colors.navText};
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
    <>
      <UserOrg show={showUser} onClose={() => setShowUser(false)} />
      <Container>
        <Wrapper>
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
            {!!org && (<LinkBase color="white" to="/events">
              Events
            </LinkBase>)}
          </Links>
        </Wrapper>
      </Container>
    </>
  )
}
