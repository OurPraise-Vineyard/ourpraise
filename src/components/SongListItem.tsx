import React from 'react'

import moreIcon from '@assets/more-vertical.svg'
import Block from '@blocks/Block'
import Comment from '@blocks/EventComment'
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
        <Block grow>
          <SongListItemTitle>{title}</SongListItemTitle>
          <SongListItemAuthors>{authors}</SongListItemAuthors>
        </Block>
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
