import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  border-radius: 4px;
  border: 1px solid #aaa;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  position: relative;
`

const Highlight = styled.div<{right:boolean}>`
  position: absolute;
  left: ${props => props.right ? '50%' : 0};
  top: 0;
  height: 100%;
  width: 50%;
  transition: left ease-out .2s;
  background: rgb(109,170,224);
  background: linear-gradient(0deg, rgba(109,170,224,1) 0%, rgba(124,187,244,1) 35%, rgba(140,195,246,1) 100%);
`

const Button = styled.button<{active:boolean}>`
  background: transparent;
  font-size: 20px;
  border: 0;
  cursor: pointer;
  position: relative;
  text-align: center;
  padding: 8px;
  flex: 1 0 50%;

  &:focus {
    outline: none;
  }

  color: ${props => props.active ? 'white' : 'black'};
  transition: color ease-out .2s;
`

export default function ToggleChords ({ showChords, setShowChords }) {
  return (
    <Wrapper>
      <Highlight right={showChords} />
      <Button onClick={() => setShowChords(false)} active={!showChords}>Hide chords</Button>
      <Button onClick={() => setShowChords(true)} active={showChords}>Show chords</Button>
    </Wrapper>
  )
}
