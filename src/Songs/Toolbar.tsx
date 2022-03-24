import React from 'react'
import { Link } from 'react-router-dom'
import { buttonBase } from 'Shared/ButtonBase'
import styled from 'styled-components'
import searchIcon from 'assets/search.svg'

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

const SearchBar = styled.input`
  font-size: 20px;
  border: none;
  flex: 1 0 auto;

  &:focus {
    outline: none;
    border: none;
  }
`

const SearchBarWrapper = styled.div`
  padding: 10px 20px;
  border: 1px solid #aaa;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1 0 auto;

  &::before {
    content: "";
    background-image: url(${searchIcon});
    width: 20px;
    height: 20px;
    display: block;
    margin-right: 10px;
  }
`

const HorizontalLine = styled.div`
  background-color: #aaa;
  width: 1px;
  display: block;
  margin: 8px 0;
`

export default function Toolbar ({ onSearch }) {
  return (
    <Row>
      <SearchBarWrapper>
        <SearchBar
          placeholder="Search"
          onChange={e => onSearch(e.target.value)}
        />
      </SearchBarWrapper>
      <HorizontalLine />
      <Button to="/songs/add">
        Add new song
      </Button>
    </Row>
  )
}
