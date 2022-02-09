import React from 'react'
import styled from 'styled-components'
import ChordSwitcher from 'ViewSong/Tools/ChordSwitcher'
import DownloadPdf from 'ViewSong/Tools/DownloadPdf'
import ToggleChords from 'ViewSong/Tools/ToggleChords'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
  margin: 16px 0;
`

export default function Tools (props) {
  return (
    <Container>
      <ToggleChords {...props} />
      <ChordSwitcher {...props} />
      <DownloadPdf link={`https://europe-west1-songdriver-firebase.cloudfunctions.net/pdf?song=${props.songId}`} label="Download PDF" />
    </Container>
  )
}
