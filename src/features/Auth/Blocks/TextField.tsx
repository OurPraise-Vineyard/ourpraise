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

const Input = styled.input`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: 16px;
  padding: 8px 0 0;

  &:focus {
    border: none;
    outline: none;
  }
`

interface TextFieldProps {
  title: string,
  name?: string,
  password?: boolean,
  onChange?: React.ChangeEventHandler<HTMLInputElement>,
  value: string,
  disabled?: boolean,
  required?: boolean,
  autoFocus?: boolean
}
export default function TextField ({ required = false, disabled = false, title = '', name = '', password = false, onChange, value, autoFocus = false }: TextFieldProps) {
  return (
    <Container>
      <Label>{title}</Label>
      <Input
        name={name}
        type={password ? 'password' : 'text'}
        onChange={onChange}
        value={value}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
      />
    </Container>
  )
}
