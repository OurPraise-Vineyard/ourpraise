import { useMemo } from 'react'
import { type UseFormRegister } from 'react-hook-form'

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import moveIcon from '~/assets/move.svg'
import removeIcon from '~/assets/x.svg'
import type { IEvent, IEventSong } from '~/types'
import { getKeyOptions } from '~/utils/chords'

type SortableListProps = {
  items: IEventSong[]
  onSwap: (indexA: number, indexB: number) => void
  onRemove: (index: number) => void
  isSortable: boolean
  register: UseFormRegister<IEvent>
}

type SortableListItemProps = {
  song: IEventSong
  index: number
  onRemove: (index: number) => void
  isSortable: boolean
  register: UseFormRegister<IEvent>
}

export default function SortableSongList({
  items,
  onSwap,
  onRemove,
  isSortable,
  register
}: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over) {
      if (active.id !== over.id) {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        onSwap(oldIndex, newIndex)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="list">
          {items.map((song, index) => (
            <SortableSongListItem
              key={song.id}
              song={song}
              index={index}
              onRemove={onRemove}
              isSortable={isSortable}
              register={register}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

function SortableSongListItem({
  song,
  index,
  onRemove,
  isSortable,
  register
}: SortableListItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: song.id })
  const keysOptions = useMemo(() => getKeyOptions(song.key), [song.key])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <li
      className="list-row hover:bg-base-200 bg-base-100 hover:z-10"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isSortable ? listeners : [])}
    >
      <div
        onClick={event => {
          console.log('mouse down')
          event.stopPropagation()
        }}
      >
        <p className="overflow-hidden font-bold text-ellipsis whitespace-nowrap">
          {song.title || (
            <span className="text-red-500 italic">Missing title</span>
          )}
        </p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap">
          {song.authors || (
            <span className="text-red-500 italic">Missing authors</span>
          )}
        </p>

        <select
          className="select mt-2 w-36"
          defaultValue={song.transposeKey}
          disabled={isSortable}
          {...register(`songs.${index}.transposeKey`)}
        >
          {keysOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-row items-center justify-end">
        {isSortable ? (
          <img src={moveIcon} className="icon box-content p-3" />
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-circle"
            onClick={() => onRemove(index)}
          >
            <img src={removeIcon} className="icon" />
          </button>
        )}
      </div>
    </li>
  )
}
