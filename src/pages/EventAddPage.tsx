import dateFormat from 'dateformat'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

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
    <Page className="mb-16">
      <MetaTitle title="Add event" />

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

            {fields.length > 0 && <p className="text-sm">Songs</p>}

            <SortableSongList items={fields} onSwap={(a, b) => move(a, b)} />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>

        <div className="col-span-2">
          <AddSongsToEvent onAdd={handleAddSong} />
        </div>
      </div>
    </Page>
  )
}
