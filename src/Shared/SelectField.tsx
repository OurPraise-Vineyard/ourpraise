import React from 'react'
import styled from 'styled-components'

const Container = styled.label`
  padding: 8px;
  background-color: #efefef;
  border-radius: 4px;
  display: block;
  margin-bottom: 16px;
`

const Label = styled.span`
  font-size: 16px;
  display: block;
`

const Select = styled.select`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: 14px;
  padding: 8px 0 0;
  font-family: 'Oxygen Mono', monospace;

  &:focus {
    border: none;
    outline: none;
  }
`

export default function SelectField ({ title = '', name = '', onChange, value, options = [] }) {
  return (
    <Container>
      <Label>{title}</Label>
      <Select
        value={value}
        name={name}
        onChange={onChange}
      >
        {options.map(option => <option key={option.key || option.value} value={option.value}>{option.label || option.value}</option>)}
      </Select>
    </Container>
  )
}
