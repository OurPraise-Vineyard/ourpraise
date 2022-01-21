import { getSong, saveSong } from 'api/songs'
import SongForm from 'EditSong/SongForm'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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
    <div>
      <SongForm song={song} onSubmit={handleSubmit} />
    </div>
  )
}
