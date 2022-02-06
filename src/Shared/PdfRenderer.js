import { getSong, getAllSongs } from 'api/songs'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font
} from '@react-pdf/renderer'

import RobotoRegular from 'assets/Roboto/Roboto-Regular.ttf'
import RobotoBold from 'assets/Roboto/Roboto-Bold.ttf'
import OxygenFont from 'assets/Oxygen_Mono/OxygenMono-Regular.ttf'
import { transposeBody } from 'chords'

Font.register({ family: 'Roboto', fonts: [
  { src: RobotoRegular, fontStyle: 'normal', fontWeight: 'normal' },
  { src: RobotoBold, fontStyle: 'normal', fontWeight: 'bold' },
  {}
] })
Font.register({ family: 'Oxygen Mono', src: OxygenFont, fontStyle: 'normal', fontWeight: 'normal' })

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    color: 'black',
    padding: '40px 60px'
  },
  section: {
  },
  viewer: {
    width: '100%',
    height: 'calc(100vh - 180px)'
  },
  body: {
    fontFamily: 'Oxygen Mono',
    fontSize: 11
  },
  heading: {
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  subheading: {
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontSize: 14,
    color: '#aaa',
    lineHeight: 1.5,
    borderBottom: '1px solid #ddd',
    marginBottom: 20
  }
})

function SongPage ({ song, transpose }) {
  return (
    <Page size="A4" style={styles.page} break>
      <View style={styles.section}>
        <Text style={styles.heading}>{song.title}</Text>
        <Text style={styles.subheading}>{song.authors}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.body}>{transposeBody(transpose, song.body)}</Text>
      </View>
    </Page>
  )
}

export default function PdfRenderer () {
  const { songId } = useParams()
  const [songs, setSongs] = useState([])
  const [params] = useSearchParams()

  const transpose = parseInt(params.get('transpose'), 10) || 0

  const docTitle = songs.length === 1 ? songs[0].title : 'Event name'

  useEffect(() => {
    if (songId) {
      getSong(songId).then(song => {
        if (song) {
          setSongs([song])
        } else {
          setSongs([])
        }
      })
    } else {
      getAllSongs().then(setSongs)
    }
  }, [songId])

  if (songs.length === 0) {
    return null
  }

  return (
    <PDFViewer style={styles.viewer}>
      <Document title={docTitle}>
        {songs.map(song => (
          <SongPage key={song.id} song={song} transpose={transpose} />
        ))}
      </Document>
    </PDFViewer>
  )
}
