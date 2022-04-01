import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import increase from '@assets/increase.svg'
import decrease from '@assets/decrease.svg'
import { generateRelativeChordList, getRelativeChord } from '@chords'

const Wrapper = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #aaa;
  display: flex;
  flex-direction: row;
  padding: 8px;
  align-items: center;
  margin-top: 16px;
`

const Chord = styled.select`
  font-size: 20px;
  flex: 1 0 auto;
  background: transparent;
  border: 0;
  appearance: none;
  &:focus {
    border: 0;
    outline: 0;
  }
`

const switchTypes = {
  increase,
  decrease,
}

const Switcher = styled.div<{ type: string }>`
  background-image: url(${props => switchTypes[props.type]});
  background-size: contain;
  width: 20px;
  height: 20px;
  flex: 0 1 auto;
`

export default function ChordSwitcher({ songKey, transpose, setTranspose }) {
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
      <Chord value={0} onChange={handleSelect}>
        {chordList.map((chord, index) => (
          <option key={index + chord} value={-(index - 11)}>
            {chord}
          </option>
        ))}
      </Chord>
      <Switcher type="increase" onClick={handleSwitch(1)} />
      <Switcher type="decrease" onClick={handleSwitch(-1)} />
    </Wrapper>
  )
}
