import classNames from 'classnames'

export interface SelectItem {
  label?: string
  value: string | number
  key?: string | number
  disabled?: boolean
}

export default function Selector({
  value,
  onChange,
  className,
  title = '',
  options = []
}: {
  options: SelectItem[]
  className?: string
  title?: string
  value: string
  onChange: (val: SelectItem) => void
}) {
  return (
    <div className={classNames('rounded bg-gray-200 p-2', className)}>
      {!!title && <span className="text-sm/3">{title}</span>}
      <select
        className="block w-full border-none bg-transparent font-sans text-lg/none focus:outline-none"
        value={value}
        onChange={e => {
          const selected = options.find(o => o.value === e.target.value)
          if (selected) {
            onChange(selected)
          }
        }}
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
