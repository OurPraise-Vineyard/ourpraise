import React from 'react'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  margin: 16px 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media print {
    display: block;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
    padding-bottom: 4px;
  }
`

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`

type PageHeaderProps = {
  title: string
  children: React.ReactNode
}
export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <Row>
      <Title>{title}</Title>
      {children}
    </Row>
  )
}
