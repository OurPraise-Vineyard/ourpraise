import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  margin: 16px 0;
`

const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 16px;
`

const Body = styled.p`
  white-space: pre;
  margin: 0;
  font-size: 20px;
`

export default function ContentBox ({ title, children }) {
  return (
    <Container>
      {!!title && <Title>{title}</Title>}
      <Body>
        {children}
      </Body>
    </Container>
  )
}
