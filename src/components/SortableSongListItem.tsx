import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { ISong } from '~/types/models'

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
      <div>
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
      </div>
    </li>
  )
}
