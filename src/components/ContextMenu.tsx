import { useEffect, useMemo } from 'react';
import * as React from 'react';

const contextMenuWidth = 160
const contextMenuItemHeight = 40

export default function ContextMenu({
  items,
  top,
  left,
  onClose
}: {
  items: { label: string; onClick: React.MouseEventHandler }[]
  top: number
  left: number
  onClose: () => void
}) {
  const contextMenuHeight = contextMenuItemHeight * items.length
  const modifiedTop = useMemo(
    () => Math.max(0, Math.min(window.innerHeight - contextMenuHeight, top)),
    [top, contextMenuHeight]
  )
  const modifiedLeft = useMemo(
    () => Math.max(0, Math.min(window.innerWidth - contextMenuWidth, left)),
    [left, contextMenuWidth]
  )

  useEffect(() => {
    window.addEventListener('scroll', onClose)
    return () => window.removeEventListener('scroll', onClose)
  }, [onClose])

  return (
    <>
      <div
        className="animate-fadeIn fixed bottom-0 left-0 right-0 top-0 z-20 bg-black bg-opacity-10"
        onClick={onClose}
      />
      <div
        className="animate-teleportIn fixed z-30 flex w-40 flex-col overflow-hidden rounded-md shadow-md"
        style={{
          top: modifiedTop,
          left: modifiedLeft
        }}
      >
        {items.map((item, index) => (
          <button
            className="h-10 cursor-pointer border-b border-b-gray-300 bg-white px-5 transition-colors duration-200 ease-out last:border-none hover:bg-gray-100"
            onClick={item.onClick}
            key={index}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  )
}
