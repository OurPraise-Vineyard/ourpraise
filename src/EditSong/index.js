import { streamSong } from 'api/songs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Song from 'ViewSong/Song'

export default function ViewSong () {
  const { songId } = useParams()
  const [song, setSong] = useState({})

  useEffect(() => {
    const stream = streamSong(songId)
      .subscribe(setSong)

    return () => stream.unsubscribe()
  }, [songId])

  return (
    <div>
      <Song song={song} />
    </div>
  )
}
