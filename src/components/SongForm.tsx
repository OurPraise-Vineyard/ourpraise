import { pageTitleStyles } from '@common-styles'
import React from 'react'
import { useNavigate } from 'react-router'

import Button from '@components/Button'

import { deleteSong } from '@backend/songs'
import useSongForm from '@hooks/forms/useSongForm'
import useErrors from '@hooks/useErrors'
import { keysOptions } from '@utils/chords'

import { SelectField, TextField, TextareaField } from './FormFields'

export default function SongForm({
  song,
  onSubmit,
  heading
}: {
  song?: ISong
  onSubmit: (options: ISongForm) => void
  heading: string
}) {
  const [{ title, authors, body, key }, setField] = useSongForm(song)
  const navigate = useNavigate()
  const { pushError } = useErrors()
  const canDelete = !!(song && song.id)

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({ title, authors, body, key, id: undefined })
  }

  const handleDelete = async e => {
    if (canDelete) {
      if (window.confirm('Delete this song?')) {
        try {
          await deleteSong(song.id)
          navigate('/songs')
        } catch (err) {
          pushError(err)
        }
      }
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSave}>
      <h2 className={pageTitleStyles}>{heading}</h2>
      <TextField
        value={title}
        title="Title"
        onChange={value => setField('title', value)}
      />
      <TextField
        value={authors}
        title="Authors"
        onChange={value => setField('authors', value)}
      />
      <SelectField
        value={key}
        title="Song Key"
        onChange={value => setField('key', value)}
        options={keysOptions}
      />
      <TextareaField
        size="large"
        value={body}
        title="Body"
        onChange={value => setField('body', value)}
      />
      <div className="flex justify-between">
        <Button variant="primary" type="submit">
          Save
        </Button>
        {canDelete && (
          <Button variant="danger" type="button" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
