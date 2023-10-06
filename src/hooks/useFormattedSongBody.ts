import { useEffect, useState } from 'react'

import { transposeSong } from '@utils/chords'

export default function useFormattedSongBody(
  song: ISong,
  showChords: boolean,
  transposeKey: IKey
): string {
  const [formattedBody, setBody] = useState('')
  const songBody = song && song.body
  const songKey = song && song.key
  useEffect(() => {
    if (songBody) {
      if (showChords) {
        if (songKey && transposeKey) {
          setBody(
            transposeSong(
              songBody.replace(/^\/\//gm, '  '),
              songKey,
              transposeKey
            )
          )
        } else {
          setBody(songBody.replace(/^\/\//gm, '  '))
        }
      } else {
        setBody(
          songBody
            .split('\n')
            .map(line => (line.trim() === '//' ? '' : line))
            .filter(line => line.substr(0, 2) !== '//' || line.trim() === '//')
            .join('\n')
            .replace(/^\n+/g, '')
            .replace(/\n{3,}/g, '\n\n')
        )
      }
    }
  }, [songBody, songKey, transposeKey, showChords])

  return formattedBody
}
