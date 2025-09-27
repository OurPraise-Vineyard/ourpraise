import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLoaderData, useNavigate } from 'react-router'

import moreIcon from '~/assets/more-vertical.svg'
import { deleteSong } from '~/backend/songs'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import IconButton from '~/components/IconButton'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import { usePopUpMenu } from '~/components/PopUpMenu'
import type { IKey, ISong } from '~/types/models'
import { getKeyOptions, transposeAndFormatSong } from '~/utils/chords'

export default function SongPage() {
  const song: ISong = useLoaderData()
  const [transposeKey, setTransposeKey] = useState<IKey>(song.key)
  const navigate = useNavigate()
  const menu = usePopUpMenu()
  const keysOptions = useMemo(() => getKeyOptions(song.key), [song.key])
  const errors = useErrorPopUp()

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

  function handleOpenMenu(e: React.MouseEvent<HTMLButtonElement>) {
    return menu.open(e, () => [
      {
        label: 'Edit song',
        onClick() {
          navigate(`/songs/${song.id}/edit`)
        }
      },
      {
        label: 'Delete song',
        danger: true,
        async onClick() {
          if (window.confirm('Delete this song?')) {
            try {
              await deleteSong(song.id)
              navigate('/songs')
            } catch (err: any) {
              errors.show(err.message)
            }
          }
        }
      }
    ])
  }

  return (
    <Page>
      <MetaTitle title={song.title} />

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
            className="cursor-pointer appearance-none rounded-full border border-slate-200 bg-slate-100 px-2.5 py-2.5 text-center text-lg transition-colors duration-200 ease-out hover:bg-slate-200 focus:outline-0 sm:px-5"
            value={transposeKey || ''}
            onChange={e => setTransposeKey(e.target.value as IKey)}
          >
            {keysOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <IconButton icon={moreIcon} onClick={handleOpenMenu} />
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
