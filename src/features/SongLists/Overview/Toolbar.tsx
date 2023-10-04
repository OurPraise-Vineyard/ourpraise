import React from 'react'
import { Link } from 'react-router-dom'
import { buttonBase } from '@components/ButtonBase'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: stretch;
  margin: 0 0 16px;
  justify-content: flex-end;

  & > *:not(:last-child) {
    margin-left: 16px;
  }
`

const Button = styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`

export default function Toolbar () {
  return (
    <Row>
      <Button to="/songlists/add">Add new songlist</Button>
    </Row>
  )
}
