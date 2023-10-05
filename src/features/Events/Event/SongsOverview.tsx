import React from 'react'
import styled from 'styled-components'

const List = styled.ul`
  display: none;
  font-size: 20px;
  page-break-after: always;
  padding: 10px 0 10px 40px;
  line-height: 1.5;

  @media print {
    display: block;
  }
`

export default function SongsOverview ({ songs }: { songs: IEventSong[] }) {
  return (
    <List>
      {songs.map((song, index) => (
        <li key={index}>{song.title}</li>
      ))}
    </List>
  )
}
