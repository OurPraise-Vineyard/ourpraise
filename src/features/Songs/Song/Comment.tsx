import AppTheme from '@styles/AppTheme'
import React from 'react'
import styled from 'styled-components'

const Title = styled.p`
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: bold;
`

const Body = styled.p`
  margin: 0;
  font-size: 20px;
  white-space: pre;
`

const Container = styled.div`
  box-shadow: ${AppTheme.boxShadow};
  background-color: ${AppTheme.colors.backgroundOffset};
  padding: 20px;
  margin-bottom: 16px;
`

export default function SongComment ({ children }) {
  return (
    <Container>
      <Title>Comment</Title>
      <Body>{children}</Body>
    </Container>
  )
}
