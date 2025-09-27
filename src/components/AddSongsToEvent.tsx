import { createRef, useEffect, useState } from 'react'

import searchIcon from '~/assets/search.svg'
import clearIcon from '~/assets/x.svg'
import { fetchSongs } from '~/backend/songs'
import useDebounced from '~/hooks/useDebounced'
import type { IEventFormSong } from '~/types/forms'
import type { ISong } from '~/types/models'
import { formatKey } from '~/utils/chords'
import { search } from '~/utils/fuzzy'

export default function AddSongsToEvent({
  onAdd,
  addedSongs
}: {
  addedSongs: IEventFormSong[]
  onAdd: (song: ISong) => void
}) {
  const [loading, setLoading] = useState(true)
  const [songs, setSongs] = useState<ISong[]>([])

  const inputRef = createRef<HTMLInputElement>()
  const [query, setQuery] = useDebounced<string>('')
  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([])

  useEffect(() => {
    if (!query) {
      setFilteredSongs([])
    } else {
      setFilteredSongs(
        search(
          query,
          songs.filter(
            song => !addedSongs.find(({ dbId }) => song.id === dbId)
          ),
          ['title', 'authors', 'body']
        )
      )
    }
  }, [songs.length, query, addedSongs.length])

  useEffect(() => {
    fetchSongs().then(songs => {
      setLoading(false)
      setSongs(songs.map(song => ({ ...song, added: false })))
    })
  }, [])

  function handleClear() {
    setQuery('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="bg-base-200 max-h-page sticky top-20 overflow-x-hidden overflow-y-auto p-4 shadow-sm">
      <p className="mb-2 font-bold">Add songs to event</p>

      <label className="input w-full grow">
        <img className="icon" src={searchIcon} />
        <input
          className="grow"
          placeholder="Search"
          onChange={e => setQuery(e.target.value)}
          ref={inputRef}
        />

        {loading ? (
          <div className="loading" />
        ) : (
          <img
            role="button"
            className="icon cursor-pointer"
            src={clearIcon}
            aria-disabled={!query}
            onClick={handleClear}
          />
        )}
      </label>

      <ul className="list mt-4">
        {!!query && (
          <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
            Search results for "{query}"
          </li>
        )}

        {filteredSongs.map(song => (
          <li
            role="button"
            key={song.id}
            className="list-row hover:bg-base-300 w-full"
            onClick={() => onAdd(song)}
          >
            <div>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {song.title || (
                  <span className="text-red-500 italic">Missing title</span>
                )}
              </p>
              <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                {song.authors || (
                  <span className="text-red-500 italic">Missing authors</span>
                )}
              </p>
            </div>
            <div className="flex flex-row items-center justify-end">
              <div className="badge badge-soft badge-accent text-nowrap break-keep">
                {formatKey(song.key)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
