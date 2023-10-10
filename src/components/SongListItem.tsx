import React from 'react'

import moreIcon from '@assets/more-vertical.svg'
import Comment from '@blocks/EventComment'
import FlexGrow from '@blocks/FlexGrow'
import IconButton from '@blocks/IconButton'
import SongListItemAuthors from '@blocks/SongListItemAuthors'
import SongListItemBody from '@blocks/SongListItemBody'
import SongListItemContainer from '@blocks/SongListItemContainer'
import SongListItemHeader from '@blocks/SongListItemHeader'
import SongListItemKey from '@blocks/SongListItemKey'
import SongListItemTitle from '@blocks/SongListItemTitle'

type SongListItemProps = {
  formattedKey?: string
  title: string
  body?: string[]
  authors: string
  comment?: string
  onOpenMenu: React.MouseEventHandler<HTMLButtonElement>
}

export default function SongListItem({
  title,
  authors,
  formattedKey,
  body = [],
  comment,
  onOpenMenu
}: SongListItemProps) {
  return (
    <SongListItemContainer>
      <SongListItemHeader>
        <FlexGrow>
          <SongListItemTitle>{title}</SongListItemTitle>
          <SongListItemAuthors>{authors}</SongListItemAuthors>
        </FlexGrow>
        {formattedKey && <SongListItemKey>{formattedKey}</SongListItemKey>}
        <IconButton icon={moreIcon} onClick={onOpenMenu} />
      </SongListItemHeader>
      {comment && <Comment>{comment}</Comment>}
      {body.map((part, index) => (
        <SongListItemBody key={index}>{part}</SongListItemBody>
      ))}
    </SongListItemContainer>
  )
}
