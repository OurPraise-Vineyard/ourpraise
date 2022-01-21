import React from 'react'
import styled from 'styled-components'
import ChordSwitcher from 'ViewSong/Tools/ChordSwitcher'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
  margin: 16px 0;
`

export default function Tools ({ songKey, transpose, setTranspose }) {
  return (
    <Container>
      <ChordSwitcher songKey={songKey} transpose={transpose} setTranspose={setTranspose} />
    </Container>
  )
}
