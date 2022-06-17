import Modal from '@features/Shared/Modal'
import React, { useState } from 'react'
import UserView from '@features/Auth/UserOrg/UserView'
import OrgView from '@features/Auth/UserOrg/OrgView'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@hooks'
import { selectOrganisation } from '@features/Auth/authSlice'
import { resetState } from '@store'

export default function UserModal ({ show, onClose }) {
  const [view, setView] = useState<'user' | 'org'>('user')
  const [selectedOrg, setSelectedOrg] = useState<string>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

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
      {view === 'user' && <UserView onEditOrg={handleEditOrg} onSelectOrg={handleSelectOrg} />}
      {view === 'org' && <OrgView selectedOrg={selectedOrg} />}
    </Modal>
  )
}
