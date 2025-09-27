import { useState } from 'react'

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
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

import type { ISong } from '~/types/models'

import SortableSongListItem from './SortableSongListItem'

type SortableListProps = {
  items: ISong[]
  onSwap: (indexA: number, indexB: number) => void
}

export default function SortableSongList({ items, onSwap }: SortableListProps) {
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
          {items.map(song => (
            <SortableSongListItem key={song.id} song={song} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
