import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLoaderData, useNavigate } from 'react-router'

import saveIcon from '~/assets/save.svg'
import { createSong, deleteSong, saveSong } from '~/backend/songs'
import { useErrorPopUp } from '~/components/ErrorPopUp'
import Page from '~/components/Page'
import useDocumentTitle from '~/hooks/useDocumentTitle'
import type { IDocId, ISong } from '~/types'
import { keysOptions } from '~/utils/chords'

export default function AddSongPage() {
  const song: ISong = useLoaderData()
  const navigate = useNavigate()
  const errorPopUp = useErrorPopUp()
  const isEdit = !!song
  const title = isEdit ? `Edit ${song.title || 'song'}` : 'Add song'
  useDocumentTitle(title)
  const [saving, setSaving] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISong>({
    values: song
  })

  const onSave = async (form: ISong) => {
    try {
      setSaving(true)

      if (isEdit) {
        await saveSong({
          ...form,
          id: song.id
        })
        navigate(`/songs/${song.id}`)
      } else {
        const id: IDocId = await createSong(form)
        if (id) {
          navigate(`/songs/${id}`)
        }
      }
    } catch (err: any) {
      errorPopUp.show(err.message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (window.confirm(`Delete song ${song.title}?`)) {
      try {
        await deleteSong(song.id)
        navigate('/songs')
      } catch (err: any) {
        errorPopUp.show(err.message)
      }
    }
  }

  return (
    <Page className="mb-16">
      <div className="breadcrumbs mb-2 text-sm">
        <ul>
          <li>
            <Link to="/songs">Songs</Link>
          </li>
          {isEdit ? (
            <>
              <li>
                <Link to={`/songs/${song.id}`}>{song.title}</Link>
              </li>
              <li>Edit song</li>
            </>
          ) : (
            <li>Add song</li>
          )}
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="mt-4 grow text-lg font-bold">{title}</h2>

          {isEdit && (
            <button
              type="button"
              className="btn btn-soft btn-error"
              onClick={onDelete}
            >
              Delete song
            </button>
          )}

          <button className="btn btn-primary" type="submit">
            <img src={saveIcon} className="icon" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        <div className="grid grid-cols-7 gap-x-16">
          <div className="col-span-2 flex flex-col gap-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Title</legend>
              <input
                type="text"
                className="input w-full"
                {...register('title', { required: true })}
              />
              {errors.title && <p className="label">Title is required</p>}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Authors</legend>
              <input
                type="text"
                className="input w-full"
                {...register('authors', { required: true })}
              />
              {errors.authors && <p className="label">Authors are required</p>}
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">Key</legend>
              <select
                className="select w-full"
                {...register('key', { required: true })}
              >
                {keysOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.key && <p className="label">Key is required</p>}
            </fieldset>
          </div>

          <div className="col-span-5">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Lyrics and chords</legend>
              <textarea
                className="textarea min-h-96 w-full overflow-auto font-mono text-sm whitespace-pre"
                placeholder="Body"
                {...register('body', { required: true })}
              />
              {errors.body && <p className="label">Song body is required</p>}
            </fieldset>
          </div>
        </div>
      </form>
    </Page>
  )
}
