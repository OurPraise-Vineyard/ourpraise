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

const Input = styled.input`
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

const sizes = {
  small: '50px',
  medium: '200px',
  large: '400px'
}

const Textarea = styled.textarea<{ size: string }>`
  background: transparent;
  width: 100%;
  display: block;
  border: none;
  font-size: 14px;
  padding: 8px 0 0;
  font-family: 'Oxygen Mono', monospace;
  min-height: ${props => sizes[props.size]};
  min-width: 100%;
  max-width: 100%;

  &:focus {
    border: none;
    outline: none;
  }
`

interface TextFieldProps {
  title?: string
  name?: string
  password?: boolean
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  value: string
  multiline?: boolean
  type?: 'text' | 'password' | 'date'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export default function TextField({
  title = '',
  name = '',
  password = false,
  onChange,
  value,
  multiline = false,
  type = 'text',
  size = 'medium',
  className
}: TextFieldProps) {
  return (
    <Container className={className}>
      <Label>{title}</Label>
      {multiline ? (
        <Textarea value={value} name={name} onChange={onChange} size={size} />
      ) : (
        <Input name={name} type={password ? 'password' : type} onChange={onChange} value={value} />
      )}
    </Container>
  )
}
