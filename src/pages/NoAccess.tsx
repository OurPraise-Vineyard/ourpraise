import React from 'react'

import Center from '@blocks/Center'

import { useDocumentTitle } from '@hooks/useDocumentTitle'

export default function NoAccessView() {
  useDocumentTitle()
  return <Center>You do not have access to view this site.</Center>
}
