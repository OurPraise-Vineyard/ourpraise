import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 4px;
  position: relative;
  margin: 16px 0;
  padding: 20px 0;
`

const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 16px;
  padding: 0 20px;
`

const Body = styled.div<{ noPadding: boolean }>`
  white-space: pre;
  font-size: 20px;
  padding: ${props => (props.noPadding ? 0 : '0 20px')};
`

export default function ContentBox ({ title, children, noPadding = false }) {
  return (
    <Container>
      {!!title && <Title>{title}</Title>}
      <Body noPadding={noPadding}>{children}</Body>
    </Container>
  )
}
