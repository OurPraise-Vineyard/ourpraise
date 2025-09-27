import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { ISong } from '~/types/models'
import { formatKey } from '~/utils/chords'

export default function SortableSongListItem({ song }: { song: ISong }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: song.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <li
      className="list-row hover:bg-base-200"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        onClick={event => {
          console.log('mouse down')
          event.stopPropagation()
        }}
      >
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {song.title || (
            <span className="text-red-500 italic">Missing title</span>
          )}
        </p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {song.authors || (
            <span className="text-red-500 italic">Missing authors</span>
          )}
        </p>

        <button className="btn" type="button" onClick={console.log}>
          Test
        </button>
      </div>
      <div className="flex flex-row items-center justify-end">
        <div className="badge badge-soft badge-accent text-nowrap break-keep">
          {formatKey(song.key)}
        </div>
      </div>
    </li>
  )
}
