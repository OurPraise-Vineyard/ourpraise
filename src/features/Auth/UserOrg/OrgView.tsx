import { useAppDispatch, useAppSelector } from '@utils/hooks'
import React, { useState } from 'react'
import styled from 'styled-components'
import backIcon from '@assets/arrow-left.svg'
import removeIcon from '@assets/x.svg'
// import SelectField from '@features/Shared/SelectField'
import IconButton from '@features/Shared/IconButton'
import {
  addOrganisationMember,
  /* changeMemberRole, */ removeOrganisationMember
} from '@state/auth/api'
import { pushError } from '@state/errorSlice'
import TextField from '@features/Shared/TextField'
import ButtonBase from '@features/Shared/ButtonBase'

const OrgName = styled.p`
  font-size: 24px;
  margin: 20px 0;
  text-align: center;
  position: relative;
`

const Line = styled.div`
  height: 0;
  border-bottom: 1px solid #ccc;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const BackButton = styled(IconButton).attrs({
  icon: backIcon
})`
  margin: 0 12px;

  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;

  margin-bottom: 16px;

  &:first-child {
    margin-top: 16px;
  }
`

const MemberInfo = styled.p`
  flex: 1 0 auto;
  padding: 0;
  font-size: 20px;
  margin: 0;
  white-space: nowrap;
`

// const StyledSelectField = styled(SelectField)`
//   margin-bottom: 0;
//   min-width: 150px;
// `

const RemoveButton = styled(IconButton).attrs({
  icon: removeIcon
})`
  margin-left: 20px;
`

const EmailField = styled(TextField)`
  flex: 1 0 auto;
  margin-bottom: 0;
  margin-right: 10px;
`

const AddMemberRow = styled.form`
  display: flex;
  align-items: stretch;
  padding: 0 20px;

  margin: 16px 0;
`

const AddMemberButton = styled(ButtonBase)`
  margin-bottom: 0;
`

const MembersHeader = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textFaded};
  padding: 0 20px;
  margin: 16px 0 0;
`

const Members = styled.div`
  overflow-y: auto;
`

// const roles = [
//   {
//     value: 'admin',
//     label: 'Admin'
//   },
//   {
//     value: 'user',
//     label: 'User'
//   }
// ]

export default function OrgView({ selectedOrg, onBack }) {
  const organisation = useAppSelector(state =>
    state.auth.organisations.find(({ id }) => id === selectedOrg)
  )
  // const userEmail = useAppSelector(state => state.auth.user.email)
  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('')

  // const handleChangeRole = async (member, value) => {
  //   if (Object.values(organisation.roles).filter(role => role === 'admin').length === 1 && value !== 'admin') {
  //     return dispatch(pushError('This organisation must have at least one administrator.'))
  //   }

  //   if (userEmail === member && value !== 'admin') {
  //     if (!window.confirm('Are you sure you want to remove your own admin privileges? Another admin will need to reassign you if you change your mind.')) {
  //       return
  //     } else {
  //       onBack()
  //     }
  //   }

  //   try {
  //     await dispatch(changeMemberRole({
  //       member,
  //       organisationId: organisation.id,
  //       role: value
  //     })).unwrap()
  //   } catch (err) {
  //     dispatch(pushError(err))
  //   }
  // }

  const handleRemoveMember = async member => {
    if (organisation.roles[member] === 'admin') {
      return dispatch(pushError('You cannot remove an administrator account.'))
    }

    if (window.confirm(`Are you sure you want to remove ${member} from this organisation?`)) {
      try {
        await dispatch(
          removeOrganisationMember({
            organisationId: organisation.id,
            member
          })
        ).unwrap()
      } catch (err) {
        dispatch(pushError(err))
      }
    }
  }

  const handleAddMember = async e => {
    e.preventDefault()
    try {
      await dispatch(
        addOrganisationMember({
          organisationId: organisation.id,
          email
        })
      ).unwrap()
    } catch (err) {
      dispatch(pushError(err))
    }

    setEmail('')
  }

  if (!selectedOrg) {
    return null
  }

  return (
    <Column>
      <OrgName>
        <BackButton onClick={onBack} />
        {organisation.name}
      </OrgName>
      <Line />
      <AddMemberRow onSubmit={handleAddMember}>
        <EmailField
          title="Add member by email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <AddMemberButton type="submit">Add member</AddMemberButton>
      </AddMemberRow>
      <Line />
      <MembersHeader>Members</MembersHeader>
      <Members>
        {organisation.members.map(member => (
          <MemberRow key={member}>
            <MemberInfo>{member}</MemberInfo>
            {/* <StyledSelectField
              value={organisation.roles[member] || 'user'}
              onChange={e => handleChangeRole(member, e.target.value)}
              options={roles}
            /> */}
            <RemoveButton onClick={() => handleRemoveMember(member)} />
          </MemberRow>
        ))}
      </Members>
    </Column>
  )
}
