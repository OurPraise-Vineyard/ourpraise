import dateFormat from 'dateformat'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'

import checkIcon from '~/assets/check.svg'
import moveIcon from '~/assets/move.svg'
import { createEvent } from '~/backend/events'
import AddSongsToEvent from '~/components/AddSongsToEvent'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import MetaTitle from '~/components/MetaTitle'
import Page from '~/components/Page'
import SortableSongList from '~/components/SortableSongList'
import type { IDocId } from '~/types/backend'
import type { IEventForm } from '~/types/forms'
import type { ISong } from '~/types/models'
import { nextWeekday } from '~/utils/date'

const defaultDate = dateFormat(nextWeekday(7), 'yyyy-mm-dd')

export default function AddEventPage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const [reordering, setReordering] = useState<boolean>(false)
  const errorPopUp = useErrorPopUp()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IEventForm>()
  const {
    fields: addedSongs,
    append,
    remove,
    move
  } = useFieldArray({
    control,
    name: 'songs'
  })

  function handleAddSong(song: ISong) {
    append({
      ...song,
      dbId: song.id,
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

  const onRemoveSong = (index: number) => {
    if (window.confirm('Remove song from event?')) {
      remove(index)
    }
  }

  console.log(control._formValues)

  return (
    <Page className="mb-16">
      <MetaTitle title="Add event" />

      <div className="breadcrumbs mb-2 text-sm">
        <ul>
          <li>
            <Link to="/events">Events</Link>
          </li>
          <li>Add event</li>
        </ul>
      </div>

      <div className="grid grid-cols-5 gap-x-16">
        <form className="col-span-3" onSubmit={handleSubmit(onSave)}>
          <div className="col-span-full mb-4 flex flex-row items-center">
            <h2 className="grow text-lg">Add event</h2>
          </div>

          <div className="my-4 flex flex-col gap-4">
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

            {addedSongs.length > 0 && (
              <div className="rounded-sm p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold">Songs</p>
                  {reordering ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setReordering(false)}
                    >
                      <img src={checkIcon} className="icon" />
                      Done
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => setReordering(true)}
                    >
                      <img src={moveIcon} className="icon" />
                      Reorder
                    </button>
                  )}
                </div>

                <SortableSongList
                  items={addedSongs}
                  onSwap={(a, b) => move(a, b)}
                  onRemove={onRemoveSong}
                  isSortable={reordering}
                  register={register}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={reordering}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>

        <div className="col-span-2">
          <AddSongsToEvent onAdd={handleAddSong} addedSongs={addedSongs} />
        </div>
      </div>
    </Page>
  )
}
