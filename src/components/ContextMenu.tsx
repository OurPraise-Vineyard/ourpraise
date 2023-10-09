import React, { useEffect, useMemo } from 'react'
import { useTheme } from 'styled-components'

import ContextMenuContainer from '@components/ContextMenuContainer'
import ContextMenuItem from '@components/ContextMenuItem'
import InvisibleBackdrop from '@components/InvisibleBackdrop'

type ContextMenuProps = {
  items: { label: string; onClick: React.MouseEventHandler }[]
  top: number
  left: number
  onClose: () => void
}
export default function ContextMenu({
  items,
  top,
  left,
  onClose
}: ContextMenuProps) {
  const {
    sizes: { contextMenuWidth, contextMenuItemHeight }
  } = useTheme()
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
      <InvisibleBackdrop onClick={onClose} />
      <ContextMenuContainer left={modifiedLeft} top={modifiedTop}>
        {items.map((item, index) => (
          <ContextMenuItem onClick={item.onClick} key={index}>
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContainer>
    </>
  )
}
