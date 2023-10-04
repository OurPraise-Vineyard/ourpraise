import { signOut } from '@state/auth/api'
import ButtonBase from '@components/ButtonBase'
import { useAppDispatch, useAppSelector } from '@utils/hooks'
import React from 'react'
import styled from 'styled-components'
import { pushError } from '@state/errorSlice'

const Username = styled.p`
  font-size: 24px;
  margin: 20px 0 0;
  text-align: center;
`

const Email = styled.p`
  font-size: 18px;
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

export default function UserView ({ onEditOrg }) {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    try {
      dispatch(signOut()).unwrap()
    } catch (err) {
      dispatch(pushError(err))
    }
  }

  return (
    <Column>
      <Username>{user.displayName}</Username>
      <Email>{user.email}</Email>
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
