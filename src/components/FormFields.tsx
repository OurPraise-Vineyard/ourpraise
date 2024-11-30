import classNames from 'classnames'
import { InputHTMLAttributes } from 'react'

interface FieldProps {
  className?: string
  title?: string
  name?: string
  onChange: (string) => void
  value: string
  autoFocus?: boolean
  required?: boolean
  disabled?: boolean
}

export interface SelectItem {
  label?: string
  value: string | number
  key?: string | number
  disabled?: boolean
}

const fieldStyles =
  'block w-full border-none bg-transparent font-sans text-lg/none focus:outline-none'

const textFieldSizes = {
  small: 'min-h-10',
  medium: 'min-h-20',
  large: 'min-h-40'
}

export function SelectField({
  className,
  title = '',
  name = '',
  onChange,
  value,
  autoFocus = false,
  required = false,
  disabled = false,
  options = []
}: FieldProps & {
  options: SelectItem[]
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <select
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
        className={fieldStyles}
        autoFocus={autoFocus}
        required={required}
        disabled={disabled}
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
      </select>
    </div>
  )
}

export function TextareaField({
  className,
  title = '',
  name = '',
  onChange,
  value,
  size = 'medium',
  autoFocus = false,
  required = false,
  disabled = false
}: FieldProps & {
  size?: keyof typeof textFieldSizes
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <textarea
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
        className={classNames(fieldStyles, textFieldSizes[size], className)}
        autoFocus={autoFocus}
        required={required}
        disabled={disabled}
      />
    </div>
  )
}

export function TextField({
  className,
  title = '',
  name = '',
  onChange,
  value,
  type = 'text',
  autoFocus = false,
  required = false,
  disabled = false,
  ...props
}: FieldProps & {
  type?: 'text' | 'password' | 'date'
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <input
        value={value}
        name={name}
        type={type}
        onChange={e => onChange(e.target.value)}
        className={classNames(fieldStyles, className)}
        autoFocus={autoFocus}
        required={required}
        disabled={disabled}
        {...props}
      />
    </div>
  )
}

export function HookTextField({
  className,
  title = '',
  type = 'text',
  fieldProps,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  type?: 'text' | 'password' | 'date'
  className?: string
  title?: string
  fieldProps: InputHTMLAttributes<HTMLInputElement>
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <input
        type={type}
        className={classNames(fieldStyles, className)}
        {...props}
        {...fieldProps}
      />
    </div>
  )
}
