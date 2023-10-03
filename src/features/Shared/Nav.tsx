import React, { useState } from 'react'
import styled from 'styled-components'
import logo from '@assets/logo_light.svg'
import Page from '@features/Shared/Page'
import { Link } from 'react-router-dom'
import LinkBase from '@features/Shared/LinkBase'
import { useAppSelector } from '@utils/hooks'
import UserOrg from '@features/Auth/UserOrg'

const Container = styled.nav`
  background-color: ${props => props.theme.colors.navBackground};
  box-shadow: ${props => props.theme.boxShadow};
`

const Logo = styled.img.attrs({
  src: logo,
  alt: 'OurPraise logo'
})`
  height: 40px;
`

const Username = styled.p`
  padding: 0;
  font-size: 20px;
  color: ${props => props.theme.colors.navText};
  cursor: pointer;
  grid-area: username;
  justify-self: end;
  margin: 0;
  white-space: nowrap;
  text-align: right;
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
    color: ${props => props.theme.colors.navText};
    text-decoration: none;
    margin-right: 20px;
  }
`

const HomeLink = styled(Link)`
  grid-area: logo;
`

export default function Nav ({ wide = false }) {
  const user = useAppSelector(state => state.auth.user)
  const [showUser, setShowUser] = useState(false)

  return (
    <>
      <UserOrg show={showUser} onClose={() => setShowUser(false)} />
      <Container>
        <Wrapper>
          <HomeLink to="/home">
            <Logo />
          </HomeLink>
          <Username onClick={() => setShowUser(true)}>
            {user ? user.displayName || user.email : ''}
          </Username>
          <Links>
            {user.role === 'admin' && (
              <>
                <LinkBase color="white" to="/events">
                  Events
                </LinkBase>
                <LinkBase color="white" to="/songs">
                  Songs
                </LinkBase>
                <LinkBase color="white" to="/songlists">
                  Song Lists
                </LinkBase>
              </>
            )}
          </Links>
        </Wrapper>
      </Container>
    </>
  )
}
