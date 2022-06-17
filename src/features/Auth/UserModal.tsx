import { selectOrganisation, signOut } from '@features/Auth/authSlice'
import ButtonBase from '@features/Shared/ButtonBase'
import Modal from '@features/Shared/Modal'
import { useAppDispatch, useAppSelector } from '@hooks'
import React from 'react'
import styled, { css } from 'styled-components'
import checkIcon from '@assets/check.svg'
import { resetState } from '@store'
import { useNavigate } from 'react-router-dom'

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
  flex: 1 0 auto;
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

export default function UserModal ({ show, onClose }) {
  const user = useAppSelector(state => state.auth.user)
  const dispatch = useAppDispatch()
  const organisations = useAppSelector(state => state.auth.organisations)
  const navigate = useNavigate()

  const handleSelectOrg = (id) => {
    navigate('/')
    dispatch(selectOrganisation(id))
    resetState()
    onClose()
  }

  const handleLogout = () => {
    dispatch(signOut())
  }

  return (
    <Modal
      onClose={onClose}
      show={show}
      blank
      narrow
    >
      <Column>
        <Username>{user.displayName}</Username>
        <Email>{user.email}</Email>
        <Line />
        <Organisations>
          {organisations.map(org => (
            <Organisation key={org.id} selected={org.selected} onClick={() => handleSelectOrg(org.id)}>{org.name}</Organisation>
          ))}
        </Organisations>
        <Line />
        <LogoutWrapper>
          <LogoutButton fullWidth onClick={handleLogout}>Sign out</LogoutButton>
        </LogoutWrapper>
      </Column>
    </Modal>
  )
}
