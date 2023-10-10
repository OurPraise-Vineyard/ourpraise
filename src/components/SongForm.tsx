import React from 'react'
import { useNavigate } from 'react-router-dom'

import { deleteSong } from '@backend/songs'
import FlexGrow from '@blocks/FlexGrow'
import FlexRow from '@blocks/FlexRow'
import Form from '@blocks/Form'
import DeleteButton from '@blocks/form/DeleteButton'
import SaveButton from '@blocks/form/SaveButton'
import Title from '@blocks/text/Title'
import SelectField from '@components/form/SelectField'
import TextField from '@components/form/TextField'
import TextArea from '@components/form/Textarea'
import useSongForm from '@hooks/forms/useSongForm'
import useErrors from '@hooks/useErrors'
import { keysOptions } from '@utils/chords'

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
    <Form onSubmit={handleSave}>
      <Title>{heading}</Title>
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
      <TextArea
        size="large"
        value={body}
        title="Body"
        onChange={value => setField('body', value)}
      />
      <FlexRow>
        <SaveButton width={canDelete ? '250px' : undefined} type="submit">
          Save
        </SaveButton>
        <FlexGrow />
        {canDelete && (
          <DeleteButton width="250px" type="button" onClick={handleDelete}>
            Delete
          </DeleteButton>
        )}
      </FlexRow>
    </Form>
  )
}
