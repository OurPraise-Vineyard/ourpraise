import classNames from 'classnames'
import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from 'react'

export interface SelectItem {
  label?: string
  value: string | number
  key?: string | number
  disabled?: boolean
}

const inputStyles =
  'block w-full border-none bg-transparent font-sans text-lg/none focus:outline-none'

const fieldStyles = 'rounded-md bg-slate-100 p-2'

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
    <div className={classNames(fieldStyles, className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <select className={inputStyles} {...props} {...fieldProps}>
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
    <div className={classNames(fieldStyles, className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <textarea
        className={classNames(inputStyles, textFieldSizes[size], className)}
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
    <div className={classNames(fieldStyles, className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <input
        type={type}
        className={classNames(inputStyles, className)}
        {...props}
        {...fieldProps}
      />
    </div>
  )
}
