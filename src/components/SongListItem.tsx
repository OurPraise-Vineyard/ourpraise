import React from 'react'

import IconButton from '@components/IconButton'

import Block from '@blocks/Block'
import Comment from '@blocks/EventComment'
import SongListItemAuthors from '@blocks/SongListItemAuthors'
import SongListItemContainer from '@blocks/SongListItemContainer'
import SongListItemHeader from '@blocks/SongListItemHeader'
import SongListItemKey from '@blocks/SongListItemKey'
import SongListItemTitle from '@blocks/SongListItemTitle'

import moreIcon from '@assets/more-vertical.svg'

type SongListItemProps = {
  formattedKey?: string
  title: string
  body?: string[]
  authors: string
  comment?: string
  onOpenMenu?: React.MouseEventHandler<HTMLButtonElement>
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
        <Block $grow>
          <SongListItemTitle>{title}</SongListItemTitle>
          <SongListItemAuthors>{authors}</SongListItemAuthors>
        </Block>
        {formattedKey && <SongListItemKey>{formattedKey}</SongListItemKey>}
        {!!onOpenMenu && <IconButton icon={moreIcon} onClick={onOpenMenu} />}
      </SongListItemHeader>
      {comment && <Comment>{comment}</Comment>}
      {body.map((part, index) => (
        <p
          className="m-0 h-0 overflow-hidden font-mono print:my-5 print:h-auto print:break-inside-avoid-page print:overflow-auto"
          key={index}
        >
          {part}
        </p>
      ))}
    </SongListItemContainer>
  )
}
