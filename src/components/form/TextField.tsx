import React from 'react'

import FieldContainer from '@blocks/form/FieldContainer'
import FieldLabel from '@blocks/form/FieldLabel'
import TextFieldInput from '@blocks/form/TextFieldInput'

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
    <FieldContainer className={className}>
      <FieldLabel>{title}</FieldLabel>
      <TextFieldInput
        name={name}
        type={password ? 'password' : type}
        onChange={e => onChange(e.target.value)}
        value={value}
        disabled={disabled}
        required={required}
        autoFocus={autoFocus}
      />
    </FieldContainer>
  )
}
