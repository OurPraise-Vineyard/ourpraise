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
  font-size: ${props => props.theme.fontSizes.small};
  display: block;
`

const Input = styled.input`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: ${props => props.theme.fontSizes.small};
  padding: 8px 0 0;
  font-family: 'Oxygen Mono', monospace;

  &:focus {
    border: none;
    outline: none;
  }
`

interface TextFieldProps {
  title?: string
  name?: string
  password?: boolean
  onChange: (string) => void
  value: string
  type?: 'text' | 'password' | 'date'
  size?: 'small' | 'medium' | 'large'
  className?: string
  autoFocus?: boolean
  required?: boolean
  disabled?: boolean
}

export default function TextField({
  title = '',
  name = '',
  password = false,
  onChange,
  value,
  type = 'text',
  size = 'medium',
  className,
  autoFocus = false,
  required = false,
  disabled = false
}: TextFieldProps) {
  return (
    <Container className={className}>
      <Label>{title}</Label>
      <Input
        name={name}
        type={password ? 'password' : type}
        onChange={e => onChange(e.target.value)}
        value={value}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
      />
    </Container>
  )
}
