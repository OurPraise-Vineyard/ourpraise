import classNames from 'classnames'
import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from 'react'

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
  options = [],
  fieldProps,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectItem[]
  className?: string
  title?: string
  fieldProps: SelectHTMLAttributes<HTMLSelectElement>
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <select className={fieldStyles} {...props} {...fieldProps}>
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
  size = 'medium',
  fieldProps,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: keyof typeof textFieldSizes
  className?: string
  title?: string
  fieldProps: TextareaHTMLAttributes<HTMLTextAreaElement>
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <textarea
        className={classNames(fieldStyles, textFieldSizes[size], className)}
        {...props}
        {...fieldProps}
      />
    </div>
  )
}

export function TextField({
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
