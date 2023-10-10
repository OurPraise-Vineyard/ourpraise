import useForm from '@hooks/forms/useForm'

const defaultSongForm: IEventSongForm = {
  comment: '',
  id: '',
  transposeKey: 'A'
}

export default function useEventSongForm(
  eventSong?: IEventSongForm,
  updateOnChange?: boolean
): IFormHookState<IEventSongForm> {
  return useForm<IEventSongForm>(eventSong, defaultSongForm, updateOnChange)
}
