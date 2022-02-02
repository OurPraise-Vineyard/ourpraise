import { streamSong } from 'api/songs'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import BackButton from 'ViewSong/Back'
import Song from 'ViewSong/Song'
import Tools from 'ViewSong/Tools'

const Layout = styled.div`
  display: flex;
  flex-direction: row;
`

const Sidebar = styled.div`
  flex: 1 0 auto;
  max-width: 300px;
  margin-right: 20px;
`

const Content = styled.div`
  flex: 1 0 auto;
  max-width: calc(100% - 300px);
`

export default function ViewSong () {
  const { songId } = useParams()
  const [song, setSong] = useState({})
  const [transpose, setTranspose] = useState(0)
  const [showChords, setShowChords] = useState(true)

  useEffect(() => {
    const stream = streamSong(songId)
      .subscribe(song => {
        setSong(song)
        setTranspose(0)
      })

    return () => stream.unsubscribe()
  }, [songId])

  return (
    <Layout>
      <Sidebar>
        <BackButton />
        <Tools
          songKey={song.key}
          transpose={transpose}
          setTranspose={setTranspose}
          showChords={showChords}
          setShowChords={setShowChords}
        />
      </Sidebar>
      <Content>
        <Song song={song} transpose={transpose} showChords={showChords} />
      </Content>
    </Layout>
  )
}
