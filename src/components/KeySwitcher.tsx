import KeySwitcherButton from 'blocks/KeySwitcherButton'
import KeySwitcherContainer from 'blocks/KeySwitcherContainer'
import KeySwitcherSelect from 'blocks/KeySwitcherSelect'
import React from 'react'
import { findNextKey, keysOptions } from 'utils/chords'

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
    <KeySwitcherContainer>
      <KeySwitcherButton
        $icon={showChords ? 'checked' : 'unchecked'}
        onClick={onToggleChords}
      />
      <KeySwitcherSelect
        value={transposeKey || ''}
        onChange={handleSelect}
        disabled={!showChords}
      >
        {keysOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </KeySwitcherSelect>
      <KeySwitcherButton
        $icon="increase"
        onClick={handleSwitch(1)}
        disabled={!showChords}
      />
      <KeySwitcherButton
        $icon="decrease"
        onClick={handleSwitch(-1)}
        disabled={!showChords}
      />
      <KeySwitcherButton
        $icon="reset"
        onClick={onResetTranspose}
        disabled={!showChords}
      />
    </KeySwitcherContainer>
  )
}
