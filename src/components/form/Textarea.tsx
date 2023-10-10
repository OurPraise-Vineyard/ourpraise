import React from 'react'

import FieldContainer from '@blocks/form/FieldContainer'
import FieldLabel from '@blocks/form/FieldLabel'
import TextAreaInput from '@blocks/form/TextAreaInput'

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
    <FieldContainer className={className}>
      <FieldLabel>{title}</FieldLabel>
      <TextAreaInput
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
        size={size}
      />
    </FieldContainer>
  )
}
