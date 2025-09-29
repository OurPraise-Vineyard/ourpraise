import dateFormat from 'dateformat'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Link, useLoaderData, useNavigate } from 'react-router'

import backIcon from '~/assets/arrow-left.svg'
import checkIcon from '~/assets/check.svg'
import moveIcon from '~/assets/move.svg'
import saveIcon from '~/assets/save.svg'
import { createEvent, deleteEvent, saveEvent } from '~/backend/events'
import AddSongsToEvent from '~/components/AddSongsToEvent'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import Page from '~/components/Page'
import SortableSongList from '~/components/SortableSongList'
import useDocumentTitle from '~/hooks/useDocumentTitle'
import type { IDocId, IEvent, ISong } from '~/types'
import { nextWeekday } from '~/utils/date'

const defaultDate = dateFormat(nextWeekday(7), 'yyyy-mm-dd')

export default function EventFormPage() {
  const event: IEvent = useLoaderData()
  const navigate = useNavigate()
  const [saving, setSaving] = useState<boolean>(false)
  const [reordering, setReordering] = useState<boolean>(false)
  const errorPopUp = useErrorPopUp()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IEvent>({
    values: event
  })
  const {
    fields: addedSongs,
    append,
    remove,
    move
  } = useFieldArray({
    control,
    name: 'songs',
    keyName: 'fieldId'
  })

  const isEdit = !!event
  const title = isEdit ? `Edit ${event.title || 'event'}` : 'Add event'

  useDocumentTitle(title)

  function handleAddSong(song: ISong) {
    append({
      ...song,
      transposeKey: song.key
    })
  }

  const onSave = async (options: IEvent) => {
    try {
      setSaving(true)

      if (isEdit) {
        await saveEvent({ ...options, id: event.id })
        navigate(`/events/${event.id}`)
      } else {
        const id: IDocId = await createEvent(options)
        if (id) {
          navigate(`/events/${id}`)
        }
      }
    } catch (err: any) {
      errorPopUp.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (window.confirm(`Delete event ${event.title}?`)) {
      try {
        await deleteEvent(event.id)
        navigate('/events')
      } catch (err: any) {
        errorPopUp.show(err.message)
      }
    }
  }

  const onRemoveSong = (index: number) => {
    if (window.confirm('Remove song from event?')) {
      remove(index)
    }
  }

  return (
    <Page className="mb-16">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/events">Events</Link>
          </li>
          {isEdit ? (
            <>
              <li>
                <Link to={`/events/${event.id}`}>{event.title}</Link>
              </li>
              <li>Edit event</li>
            </>
          ) : (
            <li>Add event</li>
          )}
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSave)} className="mt-4">
        <div className="mb-4 flex items-center gap-4">
          <Link
            to={isEdit ? `/events/${event.id}` : '/events'}
            className="btn btn-ghost shrink-0"
          >
            <img src={backIcon} className="icon" />
            Cancel
          </Link>

          <h2 className="grow text-lg">{title}</h2>

          {isEdit && (
            <button
              type="button"
              className="btn btn-soft btn-error"
              onClick={onDelete}
            >
              Delete event
            </button>
          )}

          <button className="btn btn-primary" type="submit">
            <img src={saveIcon} className="icon" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-5 gap-x-16">
          <div className="col-span-3 flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Title</legend>
                <input
                  className="input w-full"
                  {...register('title', { required: true })}
                />
                {errors.title && <p className="label">Title is required</p>}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Date</legend>
                <input
                  type="date"
                  placeholder="Date"
                  className="input w-full"
                  defaultValue={defaultDate}
                  {...register('date', { required: true })}
                />
                {errors.date && <p className="label">Date is required</p>}
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Comments</legend>
                <textarea
                  className="textarea w-full"
                  {...register('comment')}
                />
              </fieldset>

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
          </div>

          <div className="col-span-2">
            <AddSongsToEvent onAdd={handleAddSong} addedSongs={addedSongs} />
          </div>
        </div>
      </form>
    </Page>
  )
}
