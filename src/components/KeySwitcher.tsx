import classNames from 'classnames'
import { ButtonHTMLAttributes } from 'react';

import checked from '@assets/check-square.svg'
import decrease from '@assets/decrease.svg'
import increase from '@assets/increase.svg'
import reset from '@assets/reset.svg'
import unchecked from '@assets/square.svg'
import { findNextKey, keysOptions } from '@utils/chords'

const icons = {
  increase,
  decrease,
  reset,
  checked,
  unchecked
}

function KeySwitcherButton({
  icon,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: keyof typeof icons
  disabled?: boolean
}) {
  return (
    <button
      tabIndex={-1}
      disabled={disabled}
      className={classNames(
        'h-5 w-5 flex-shrink-0 cursor-pointer rounded-full border-none bg-transparent p-1 transition-all duration-200 ease-out focus:border-0 focus:outline-0',
        disabled && 'cursor-default opacity-50',
        !disabled && 'hover:bg-black/10'
      )}
      style={{
        backgroundImage: `url("${icons[icon]}")`,
        backgroundSize: '90% 90%',
        backgroundPosition: 'center'
      }}
      {...props}
    />
  )
}

type KeySwitcherProps = {
  transposeKey: IKey
  setTransposeKey: (key: IKey) => void
  onResetTranspose: () => void
  onToggleChords: () => void
  showChords: boolean
}
export default function KeySwitcher({
  transposeKey = 'A',
  setTransposeKey,
  onResetTranspose,
  onToggleChords,
  showChords
}: KeySwitcherProps) {
  const handleSwitch = (movement: 1 | -1) => () => {
    setTransposeKey(findNextKey(transposeKey, movement))
  }
  const handleSelect = e => {
    setTransposeKey(e.target.value)
  }

  return (
    <div className="flex h-toolbar items-center rounded-md border border-gray-400 p-4">
      <KeySwitcherButton
        icon={showChords ? 'checked' : 'unchecked'}
        onClick={onToggleChords}
      />
      <select
        className={classNames(
          'mx-1 flex-1 appearance-none border-0 bg-transparent text-right text-lg transition-opacity duration-200 ease-out focus:outline-0',
          !showChords && 'opacity-50'
        )}
        value={transposeKey || ''}
        onChange={handleSelect}
        disabled={!showChords}
      >
        {keysOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <KeySwitcherButton
        icon="increase"
        onClick={handleSwitch(1)}
        disabled={!showChords}
      />
      <KeySwitcherButton
        icon="decrease"
        onClick={handleSwitch(-1)}
        disabled={!showChords}
      />
      <KeySwitcherButton
        icon="reset"
        onClick={onResetTranspose}
        disabled={!showChords}
      />
    </div>
  )
}
