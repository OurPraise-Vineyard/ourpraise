import Modal from '@features/Shared/Modal'
import React, { useState } from 'react'
import UserView from '@features/Auth/UserOrg/UserView'
import OrgView from '@features/Auth/UserOrg/OrgView'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@hooks'
import { selectOrganisation } from '@features/Auth/authSlice'
import { resetState } from '@store'
import styled from 'styled-components'

const TransitionContainer = styled.div<{ width: string, hide: boolean, showModal: boolean }>`
  width: ${props => props.width};
  margin: 0 auto;
  opacity: ${props => props.hide ? 0 : 1};
  transition: opacity .3s ease-out;
  transition-delay: ${props => props.hide ? '0' : '.2s'};
  height: 100%;
  position: absolute;
  top: 0;
  left: calc(50% - ${props => props.width} / 2);
  pointer-events: ${props => props.hide ? 'none' : props => props.showModal ? 'all' : 'none'};
`

export default function UserOrg ({ show, onClose }) {
  const [view, setView] = useState<'user' | 'org'>('user')
  const [selectedOrg, setSelectedOrg] = useState<string>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const hasOrg = useAppSelector(state => !!state.auth.organisation)

  const handleClose = () => {
    setTimeout(() => setView('user'), 200)
    onClose()
  }

  const handleEditOrg = (id: string) => {
    setView('org')
    setSelectedOrg(id)
  }

  const handleSelectOrg = (id) => {
    navigate('/')
    dispatch(selectOrganisation(id))
    resetState()
    handleClose()
  }

  return (
    <Modal
      onClose={handleClose}
      show={show}
      blank
      narrow={view === 'user'}
    >
      <TransitionContainer showModal={show} hide={view !== 'user'} width="400px"><UserView onEditOrg={handleEditOrg} onSelectOrg={handleSelectOrg} /></TransitionContainer>
      {hasOrg && <TransitionContainer showModal={show} hide={view !== 'org'} width="800px"><OrgView onBack={() => setView('user')} selectedOrg={selectedOrg} /></TransitionContainer>}
    </Modal>
  )
}
