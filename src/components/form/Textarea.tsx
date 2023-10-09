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
  font-size: ${props => props.theme.fontSizes.small};
  padding: 8px 0 0;
  font-family: 'Oxygen Mono', monospace;
  min-height: ${props => sizes[props.size]};
  min-width: 100%;

  &:focus {
    border: none;
    outline: none;
  }
`

interface TextAreaProps {
  title?: string
  name?: string
  onChange: (string) => void
  value: string
  size?: 'small' | 'medium' | 'large'
  className?: string
  autoFocus?: boolean
  required?: boolean
  disabled?: boolean
}

export default function TextArea({
  title = '',
  name = '',
  onChange,
  value,
  size = 'medium',
  className,
  autoFocus = false,
  required = false,
  disabled = false
}: TextAreaProps) {
  return (
    <Container className={className}>
      <Label>{title}</Label>
      <Textarea
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
        size={size}
      />
    </Container>
  )
}
