import { getSong, saveSong } from 'api/songs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SongForm from 'Shared/SongForm'

export default function EditSong () {
  const { songId } = useParams()
  const [song, setSong] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    getSong(songId).then(setSong)
  }, [songId])

  const handleSubmit = async (options) => {
    try {
      await saveSong(songId, options)
      navigate('/songs/' + songId)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <SongForm
      song={song}
      onSubmit={handleSubmit}
      heading="Edit song"
    />
  )
}
