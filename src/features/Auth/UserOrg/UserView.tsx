import { signOut } from '@features/Auth/authSlice'
import ButtonBase from '@features/Shared/ButtonBase'
import { useAppDispatch, useAppSelector } from '@utils/hooks'
import React from 'react'
import styled, { css } from 'styled-components'
import checkIcon from '@assets/check.svg'
import gearIcon from '@assets/gear.svg'
import IconButton from '@features/Shared/IconButton'

const Username = styled.p`
  font-size: 24px;
  margin: 20px 0 0;
  text-align: center;
`

const Email = styled.p`
  font-size: 18px;
  color: #aaa;
  margin: 0 0 25px;
  text-align: center;
`

const Line = styled.div`
  height: 0;
  border-bottom: 1px solid #ccc;
`

const Organisation = styled.div<{ selected: boolean }>`
  padding: 20px;
  font-size: 20px;

  transition: background-color .2s ease-out;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${props => props.selected && css`
    &::after {
      content: "";
      background-image: url(${checkIcon});
      background-size: contain;
      background-position: center;
      background-repeat: none;
      width: 20px;
      height: 20px;

      flex: 0 1 auto;
    }
  `}
`

const Organisations = styled.div`
  overflow-y: auto;
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

const OrganisationBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 auto;
`

const SettingsButton = styled(IconButton).attrs({
  icon: gearIcon
})`
  margin: -8px 8px;
`

const Spacer = styled.div`flex: 1 0 auto;`

const NoOrganisations = styled.p`
  font-size: 18px;
  color: #aaa;
  text-align: center;
  margin: 15px 0;
`

export default function UserView ({ onEditOrg, onSelectOrg }) {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const organisations = useAppSelector(state => state.auth.organisations)

  const handleEdit = id => (e) => {
    e.stopPropagation()

    onEditOrg(id)
  }

  const handleLogout = () => {
    dispatch(signOut())
  }

  return (
    <Column>
      <Username>{user.displayName}</Username>
      <Email>{user.email}</Email>
      <Line />
      <Organisations>
        {organisations.map(org => (
          <Organisation key={org.id} selected={org.selected} onClick={() => onSelectOrg(org.id)}>
            <OrganisationBody>
              {org.name}
              {org.roles[user.email] === 'admin' && (
                <SettingsButton onClick={handleEdit(org.id)} />
              )}
            </OrganisationBody>
          </Organisation>
        ))}
        {organisations.length === 0 && (
          <NoOrganisations>
            You are not a member of any organisation.
          </NoOrganisations>
        )}
      </Organisations>
      <Spacer />
      <Line />
      <LogoutWrapper>
        <LogoutButton fullWidth onClick={handleLogout}>Sign out</LogoutButton>
      </LogoutWrapper>
    </Column>
  )
}
