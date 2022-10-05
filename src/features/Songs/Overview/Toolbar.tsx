import React from 'react'
import { Link } from 'react-router-dom'
import { buttonBase } from '@features/Shared/ButtonBase'
import styled from 'styled-components'
import SearchSongs from '@features/Shared/SearchSongs'
import AppTheme from '@styles/AppTheme'

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
  background-color: ${AppTheme.colors.border};
  width: 1px;
  display: block;
  margin: 8px 0;
`

export default function Toolbar({ onSearch, onChangeLoading }) {
  return (
    <Row>
      <SearchSongs onSearch={onSearch} onChangeLoading={onChangeLoading} />
      <HorizontalLine />
      <Button to="/songs/add">Add new song</Button>
    </Row>
  )
}
