import { pageTitleStyles } from '@common-styles'

import Button from '@components/Button'

import useSongForm from '@hooks/forms/useSongForm'
import { keysOptions } from '@utils/chords'

import { SelectField, TextField, TextareaField } from './FormFields'

export default function SongForm({
  song,
  onSubmit,
  onDelete,
  heading
}: {
  song?: ISong
  onSubmit: (options: ISongForm) => void
  onDelete?: () => void
  heading: string
}) {
  const [{ title, authors, body, key }, setField] = useSongForm(song)

  const handleSave = async e => {
    e.preventDefault()
    onSubmit({ title, authors, body, key, id: undefined })
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
        {!!onDelete && (
          <Button variant="danger" type="button" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
