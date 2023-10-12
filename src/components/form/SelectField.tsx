import React from 'react'

import FieldContainer from '@blocks/form/FieldContainer'
import FieldLabel from '@blocks/form/FieldLabel'
import SelectFieldInput from '@blocks/form/SelectFieldInput'

export interface SelectItem {
  label?: string
  value: string | number
  key?: string | number
  disabled?: boolean
}

interface SelectFieldProps {
  title?: string
  name?: string
  onChange: (string) => void
  value: string
  options: SelectItem[]
  className?: string
}

export default function SelectField({
  className,
  title = '',
  name = '',
  onChange,
  value,
  options = []
}: SelectFieldProps) {
  return (
    <FieldContainer className={className}>
      {!!title && <FieldLabel>{title}</FieldLabel>}
      <SelectFieldInput
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
        $noTitle={!title}
      >
        {options.map(option => (
          <option
            disabled={option.disabled}
            key={option.key || option.value}
            value={option.value}
          >
            {option.label || option.value}
          </option>
        ))}
      </SelectFieldInput>
    </FieldContainer>
  )
}
