import { useDocumentTitle } from '@hooks/useDocumentTitle'
import React from 'react'
import styled from 'styled-components'

const Center = styled.p`
  text-align: center;
`

export default function NoAccessView () {
  useDocumentTitle()
  return <Center>You do not have access to view this site.</Center>
}
