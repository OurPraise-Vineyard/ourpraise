import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useLoaderData } from 'react-router'

import editIcon from '~/assets/edit.svg'
import Page from '~/components/Page'
import useDocumentTitle from '~/hooks/useDocumentTitle'
import type { IKey, ISong } from '~/types/models'
import { getKeyOptions, transposeAndFormatSong } from '~/utils/chords'

export default function SongPage() {
  const song: ISong = useLoaderData()
  useDocumentTitle(song.title)
  const [transposeKey, setTransposeKey] = useState<IKey>(song.key)
  const keysOptions = useMemo(() => getKeyOptions(song.key), [song.key])

  const [formattedBody, setFormattedBody] = useState<string[]>([])

  useEffect(() => {
    if (song) {
      setFormattedBody(
        transposeAndFormatSong({
          body: song.body,
          fromKey: song.key,
          toKey: transposeKey,
          showChords: true
        })
      )
    }
  }, [song, transposeKey])

  return (
    <Page>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <NavLink to="/songs">Songs</NavLink>
          </li>
          <li>{song.title}</li>
        </ul>
      </div>

      <div className="mt-9 mb-4 flex items-start gap-3 px-5 sm:px-0">
        <div className="w-1/2">
          <h2 className="text-title font-bold">{song.title}</h2>
          <p className="text-lg">{song.authors}</p>
        </div>
        <span className="grow" />
        <div className="flex items-center gap-3">
          <select
            className="select"
            value={transposeKey || ''}
            onChange={e => setTransposeKey(e.target.value as IKey)}
          >
            {keysOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Link to={`/songs/${song.id}/edit`} className="btn">
            <img src={editIcon} className="icon" />
            Edit
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto px-5 pb-5 sm:px-0">
        {formattedBody.map((formattedBody, i) => (
          <p key={i} className="my-5 font-mono text-sm whitespace-pre">
            {formattedBody}
          </p>
        ))}
      </div>
    </Page>
  )
}
