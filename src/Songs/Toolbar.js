import React from 'react'
import { Link } from 'react-router-dom'
import { buttonBase } from 'Shared/ButtonBase'
import styled from 'styled-components'

const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
`

const Button = styled(Link)`
  ${buttonBase}
  text-decoration: none;
`

export default function Toolbar () {
  return (
    <Row>
      <Button to="/songs/add">
        Add new song
      </Button>
    </Row>
  )
}
