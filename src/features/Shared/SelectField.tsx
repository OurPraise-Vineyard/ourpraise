import React from 'react'
import styled from 'styled-components'

const Container = styled.label`
  padding: 8px;
  background-color: ${props => props.theme.colors.subtleInput};
  border-radius: 4px;
  display: block;
  margin-bottom: 16px;
`

const Label = styled.span`
  font-size: 16px;
  display: block;
`

const Select = styled.select<{ noTitle: boolean }>`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: 14px;
  padding: ${props => (props.noTitle ? 0 : '8px')} 0 0;
  font-family: 'Oxygen Mono', monospace;

  &:focus {
    border: none;
    outline: none;
  }
`

export interface SelectItem {
  label?: string,
  value: string | number,
  key?: string | number,
  disabled?: boolean
}

interface SelectFieldProps {
  title?: string,
  name?: string,
  onChange: React.ChangeEventHandler<HTMLSelectElement>,
  value: string,
  options: SelectItem[],
  className?: string
}

export default function SelectField ({ className, title = '', name = '', onChange, value, options = [] }: SelectFieldProps) {
  return (
    <Container className={className}>
      {!!title && <Label>{title}</Label>}
      <Select
        value={value}
        name={name}
        onChange={onChange}
        noTitle={!title}
      >
        {options.map(option => <option disabled={option.disabled} key={option.key || option.value} value={option.value}>{option.label || option.value}</option>)}
      </Select>
    </Container>
  )
}
