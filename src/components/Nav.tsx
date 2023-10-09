import React, { useState } from 'react'
import styled from 'styled-components'

import Logo from '@components/Logo'
import NavMenuItem from '@components/NavMenuItem'
import Page from '@components/Page'
import UserModal from '@components/UserModal'
import useAuth from '@hooks/useAuth'

const Container = styled.nav`
  background-color: ${props => props.theme.colors.navBackground};
  box-shadow: ${props => props.theme.boxShadow};

  @media print {
    display: none;
  }
`

const Username = styled.p`
  padding: 0;
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.navText};
  cursor: pointer;
  grid-area: username;
  justify-self: end;
  margin: 0;
  white-space: nowrap;
  text-align: right;
`

const StyledLogo = styled(Logo)`
  height: 40px;
  grid-area: logo;
  margin-bottom: 2px;
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
    font-size: ${props => props.theme.fontSizes.small};
    color: ${props => props.theme.colors.navText};
    text-decoration: none;
    margin-right: 20px;
  }
`

export default function Nav() {
  const { user } = useAuth()
  const [showUser, setShowUser] = useState(false)

  return (
    <>
      <UserModal show={showUser} onClose={() => setShowUser(false)} />
      <Container>
        <Wrapper>
          <StyledLogo />
          <Username onClick={() => setShowUser(true)}>
            {user ? user.displayName || user.email : ''}
          </Username>
          <Links>
            {user?.role === 'admin' && (
              <>
                <NavMenuItem to="/events">Events</NavMenuItem>
                <NavMenuItem to="/songs">Songs</NavMenuItem>
              </>
            )}
          </Links>
        </Wrapper>
      </Container>
    </>
  )
}
