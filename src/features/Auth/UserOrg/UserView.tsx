import React from 'react'
import styled from 'styled-components'

import ButtonBase from '@components/ButtonBase'
import useAuth from '@hooks/useAuth'

const Username = styled.p`
  font-size: ${props => props.theme.fontSizes.large};
  margin: 20px 0 0;
  text-align: center;
`

const Email = styled.p`
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.textFaded};
  margin: 0 0 25px;
  text-align: center;
`

const Line = styled.div`
  height: 0;
  border-bottom: 1px solid #ccc;
`

const LogoutWrapper = styled.div`
  padding: 20px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const LogoutButton = styled(ButtonBase)`
  margin: 0;
`

const Spacer = styled.div`
  flex: 1 0 auto;
`

export default function UserView({ onEditOrg }) {
  const { user, signOut } = useAuth()
  const handleLogout = () => signOut()

  return (
    <Column>
      <Username>{user?.displayName}</Username>
      <Email>{user?.email}</Email>
      <Line />
      <Spacer />
      <LogoutWrapper>
        <LogoutButton fullWidth onClick={handleLogout}>
          Sign out
        </LogoutButton>
      </LogoutWrapper>
    </Column>
  )
}
