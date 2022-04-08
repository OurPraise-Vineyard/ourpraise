import { getFunctionUrl } from '@api/functions'
import React from 'react'
import styled from 'styled-components'
import ChordSwitcher from '@ViewSong/Tools/ChordSwitcher'
import DownloadPdf from '@ViewSong/Tools/DownloadPdf'
import ToggleChords from '@ViewSong/Tools/ToggleChords'
import { useParams } from 'react-router-dom'

const Container = styled.div`
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.2);
  background-color: white;
  padding: 20px;
  margin: 16px 0;
`

export default function Tools (props) {
  const { eventId } = useParams()

  return (
    <Container>
      <ToggleChords {...props} />
      <ChordSwitcher {...props} />
      {!eventId && (
        <>
          <DownloadPdf link={getFunctionUrl('pdf', { song: props.songId, transpose: props.transpose })} label="Download PDF" />
        </>
      )}
    </Container>
  )
}
