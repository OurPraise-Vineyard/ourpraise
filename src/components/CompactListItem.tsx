import {
  CompactListItemButton,
  CompactListItemLink
} from 'blocks/CompactListItemContainer'
import EllipsisText from 'blocks/text/EllipsisText'
import React from 'react'

type CompactListItemProps = {
  primary?: string
  secondary?: string
  to?: string
  onClick?: React.MouseEventHandler
  highlight?: boolean
}
export default function CompactListItem({
  primary = '',
  secondary = '',
  to,
  onClick,
  highlight
}: CompactListItemProps) {
  if (to) {
    return (
      <CompactListItemLink highlight={highlight} to={to}>
        <EllipsisText color="text" maxWidth="45%">
          {primary}
        </EllipsisText>
        <EllipsisText color="textFaded" maxWidth="45%">
          {secondary}
        </EllipsisText>
      </CompactListItemLink>
    )
  } else if (onClick) {
    return (
      <CompactListItemButton highlight={highlight} onClick={onClick}>
        <EllipsisText color="text" maxWidth="45%">
          {primary}
        </EllipsisText>
        <EllipsisText color="textFaded" maxWidth="45%">
          {secondary}
        </EllipsisText>
      </CompactListItemButton>
    )
  }
  return <></>
}
