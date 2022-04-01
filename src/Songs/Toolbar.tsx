import React from 'react'
import { Link } from 'react-router-dom'
import { buttonBase } from '@Shared/ButtonBase'
import styled from 'styled-components'
import SearchSongs from '@Shared/SearchSongs'

const Row = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: stretch;
  margin: 0 0 16px;

  & > *:not(:last-child) {
    margin-right: 16px;
  }
`

const Button = styled(Link)`
  ${buttonBase}
  margin: 0;
  text-decoration: none;
`

const HorizontalLine = styled.div`
  background-color: #aaa;
  width: 1px;
  display: block;
  margin: 8px 0;
`

export default function Toolbar({ onLoadHits, onChangeLoading }) {
  return (
    <Row>
      <SearchSongs onLoadHits={onLoadHits} onChangeLoading={onChangeLoading} />
      <HorizontalLine />
      <Button to="/songs/add">Add new song</Button>
    </Row>
  )
}
