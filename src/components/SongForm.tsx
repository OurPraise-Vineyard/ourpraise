import { useForm } from 'react-hook-form'

import Button from '~/components/Button'
import { keysOptions } from '~/utils/chords'

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
  const { register, handleSubmit } = useForm<ISongForm>()

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-title font-bold">{heading}</h2>
      <input className="hidden" defaultValue={song?.id} {...register('id')} />
      <TextField
        title="Title"
        fieldProps={register('title', { required: true })}
        defaultValue={song?.title}
      />
      <TextField
        title="Authors"
        fieldProps={register('authors', { required: true })}
        defaultValue={song?.authors}
      />
      <SelectField
        title="Song Key"
        options={keysOptions}
        fieldProps={register('key', { required: true })}
        defaultValue={song?.key}
      />
      <TextareaField
        size="large"
        title="Body"
        fieldProps={register('body', { required: true })}
        defaultValue={song?.body}
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
