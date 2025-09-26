import dateFormat from 'dateformat'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useLoaderData, useNavigate } from 'react-router'

import { createEvent } from '~/backend/events'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SearchField from '~/components/SearchField'
import type { IDocId } from '~/types/backend'
import type { IEventForm } from '~/types/forms'
import type { ISong } from '~/types/models'
import { nextWeekday } from '~/utils/date'
import { search } from '~/utils/fuzzy'

const defaultDate = dateFormat(nextWeekday(7), 'yyyy-mm-dd')

export default function AddEventPage() {
  const navigate = useNavigate()
  const songs: ISong[] = useLoaderData()
  const [saving, setSaving] = useState<boolean>(false)
  const errorPopUp = useErrorPopUp()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IEventForm>()
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'songs'
    }
  )

  const [query, setQuery] = useState<string>('')

  const [filteredSongs, setFilteredSongs] = useState<ISong[]>([])

  useEffect(() => {
    if (!query) {
      setFilteredSongs([])
    } else {
      setFilteredSongs(search(query, songs, ['title', 'authors', 'body']))
    }
  }, [songs, query])

  function handleAddSong(song: ISong) {
    append({
      ...song,
      transposeKey: song.key
    })
  }

  const onSave = async (options: IEventForm) => {
    try {
      setSaving(true)
      const id: IDocId = await createEvent(options)
      if (id) {
        navigate(`/events/${id}`)
      }
    } catch (err: any) {
      errorPopUp.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <MetaTitle title="Add event" />

      <div className="grid grid-cols-5 gap-x-16">
        <form className="col-span-3" onSubmit={handleSubmit(onSave)}>
          <div className="col-span-full mb-4 flex flex-row items-center">
            <h2 className="grow text-lg">Add event</h2>

            <button type="submit" className="btn btn-primary">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <input
              className="input w-full"
              placeholder="Title"
              {...register('title', { required: true })}
            />
            <input
              type="date"
              placeholder="Date"
              className="input w-full"
              defaultValue={defaultDate}
              {...register('date', { required: true })}
            />
            <textarea
              className="textarea w-full"
              placeholder="Set comments"
              {...register('comment')}
            />

            {fields.length > 0 && <p className="text-sm">Songs</p>}

            <ul className="list">
              {fields.map(field => (
                <li
                  role="button"
                  key={field.id}
                  className="list-row hover:bg-base-200"
                >
                  <div className="list-col-grow">
                    <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
                      {field.title || (
                        <span className="text-red-500 italic">
                          Missing title
                        </span>
                      )}
                    </p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                      {field.authors || (
                        <span className="text-red-500 italic">
                          Missing authors
                        </span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </form>

        <div className="bg-base-200 col-span-2 p-4 shadow-sm">
          <p className="mb-2 font-bold">Add songs to event</p>

          <SearchField onSearch={setQuery} className="w-full" />

          <ul className="list mt-4 max-h-screen">
            {!!query && (
              <li className="p-4 pb-2 text-xs tracking-wide opacity-60">
                Search results for "{query}"
              </li>
            )}

            {filteredSongs.slice(0, 5).map(song => (
              <li
                role="button"
                key={song.id}
                className="list-row hover:bg-base-300 w-full"
                onClick={() => handleAddSong(song)}
              >
                <div className="list-col-grow max-w-full">
                  <p className="w-1/2 overflow-hidden text-ellipsis whitespace-nowrap">
                    {song.title || (
                      <span className="text-red-500 italic">Missing title</span>
                    )}
                  </p>
                  <p className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {song.authors || (
                      <span className="text-red-500 italic">
                        Missing authors
                      </span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Page>
  )
}
