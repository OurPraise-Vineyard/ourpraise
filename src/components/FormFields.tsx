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

const fontStyles = {
  'sans': 'font-sans text-lg/none',
  'mono': 'font-mono text-sm'
}
const inputStyles = (font: keyof typeof fontStyles) => 
  `block w-full border-none bg-transparent focus:outline-none ${fontStyles[font]}`

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
  error,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectItem[]
  className?: string
  title?: string
  fieldProps: SelectHTMLAttributes<HTMLSelectElement>
  error?: string
}) {
  return (
    <>
      <div className={classNames(fieldStyles, className)}>
        {!!title && <span className="text-sm/3">{title}</span>}
        <select className={inputStyles('sans')} {...props} {...fieldProps}>
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
      {error && <div className="text-red-500">{error}</div>}
    </>
  )
}

export function TextareaField({
  className,
  title = '',
  size = 'medium',
  fieldProps,
  error,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  size?: keyof typeof textFieldSizes
  className?: string
  title?: string
  fieldProps: TextareaHTMLAttributes<HTMLTextAreaElement>
  error?: string
}) {
  return (
    <>
      <div className={classNames(fieldStyles, className)}>
        {!!title && <span className="text-sm/3">{title}</span>}
        <textarea
          className={classNames(inputStyles('mono'), textFieldSizes[size], className)}
          {...props}
          {...fieldProps}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </>
  )
}

export function TextField({
  className,
  title = '',
  type = 'text',
  fieldProps,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  type?: 'text' | 'password' | 'date'
  className?: string
  title?: string
  fieldProps: InputHTMLAttributes<HTMLInputElement>
  error?: string
}) {
  return (
    <>
      <div className={classNames(fieldStyles, className)}>
        {!!title && <span className="text-sm/3">{title}</span>}
        <input
          type={type}
          className={classNames(inputStyles('sans'), className)}
          {...props}
          {...fieldProps}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </>
  )
}
