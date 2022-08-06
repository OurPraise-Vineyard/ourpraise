import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import increase from '@assets/increase.svg'
import decrease from '@assets/decrease.svg'
import reset from '@assets/reset.svg'
import unchecked from '@assets/square.svg'
import checked from '@assets/check-square.svg'
import { generateRelativeChordList, getRelativeChord } from '@utils/chords'

const Wrapper = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #aaa;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  grid-area: chords;
  align-self: flex-start;
`

const Chord = styled.select`
  font-size: 20px;
  flex: 1 0 auto;
  background: transparent;
  border: 0;
  appearance: none;
  margin: 0 5px;
  text-align: right;
  transition: all .2s ease-out;

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    border: 0;
    outline: 0;
  }
`

const switchTypes = {
  increase,
  decrease,
  reset,
  checked,
  unchecked
}

const Switcher = styled.button.attrs({
  tabIndex: -1
})<{ icon: string }>`
  background-image: url(${props => switchTypes[props.icon]});
  background-size: 90% 90%;
  background-position: center;
  background-color: transparent;
  border: none;
  width: 20px;
  height: 20px;
  flex: 0 1 auto;
  border-radius: 50%;
  transition: all .2s ease-out;
  padding: 5px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:focus {
    border: 0;
    outline: 0;
  }
`

export default function ChordSwitcher({ songKey, transpose, setTranspose, onResetTranspose, onToggleChords, showChords }) {
  const [chordList, setKeyList] = useState([])
  const handleSwitch = movement => () => {
    if (movement > 0) {
      setTranspose((transpose + movement + 12) % 12)
    } else if (movement < 0) {
      setTranspose((transpose + movement - 12) % 12)
    }
  }
  const handleSelect = e => {
    handleSwitch(parseInt(e.target.value, 10))()
  }

  useEffect(() => {
    if (songKey) {
      const key = getRelativeChord(songKey, transpose)
      setKeyList(generateRelativeChordList(key))
    }
  }, [songKey, transpose])

  return (
    <Wrapper>
      <Switcher icon={showChords ? 'checked' : 'unchecked'} onClick={onToggleChords} />
      <Chord value={0} onChange={handleSelect} disabled={!showChords}>
        {chordList.map((chord, index) => (
          <option key={index + chord} value={-(index - 11)}>
            {chord}
          </option>
        ))}
      </Chord>
      <Switcher icon="increase" onClick={handleSwitch(1)} disabled={!showChords} />
      <Switcher icon="decrease" onClick={handleSwitch(-1)} disabled={!showChords} />
      <Switcher icon="reset" onClick={onResetTranspose} disabled={!showChords} />
    </Wrapper>
  )
}
