import { useAppSelector } from '@hooks'
import React from 'react'
import styled from 'styled-components'
import backIcon from '@assets/arrow-left.svg'

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

const BackButton = styled.button`
  background-color: transparent;
  background-image: url(${backIcon});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px 20px;
  border: 0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: background-color .2s ease-out;
  cursor: pointer;
  margin: 0 12px;

  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  &:hover {
    background-color: #ddd;
  }
`

export default function OrgView ({ selectedOrg, onBack }) {
  const organisation = useAppSelector(state => state.auth.organisations.find(({ id }) => id === selectedOrg))

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
    </Column>
  )
}
