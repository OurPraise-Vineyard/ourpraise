import { useForm } from 'react-hook-form'

import type { ISongForm } from '~/types/forms'
import type { ISong } from '~/types/models'
import { keysOptions } from '~/utils/chords'

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
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ISongForm>()

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-title mt-4 font-bold">{heading}</h2>
      <input className="hidden" defaultValue={song?.id} {...register('id')} />
      <TextField
        title="Title"
        fieldProps={register('title', { required: true })}
        defaultValue={song?.title}
        error={errors.title && 'Title is required'}
      />
      <TextField
        title="Authors"
        fieldProps={register('authors', { required: true })}
        defaultValue={song?.authors}
        error={errors.authors && 'Authors are required'}
      />
      <SelectField
        title="Song Key"
        options={keysOptions}
        fieldProps={register('key', { required: true })}
        defaultValue={song?.key}
        error={errors.key && 'Song key is required'}
      />
      <TextareaField
        size="large"
        title="Body"
        fieldProps={register('body', { required: true })}
        defaultValue={song?.body}
        error={errors.body && 'Song body is required'}
      />
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </form>
  )
}
