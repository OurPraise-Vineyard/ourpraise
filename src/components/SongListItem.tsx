import { ellipsisTextStyles } from '@common-styles'
import classNames from 'classnames'
import React from 'react'

import IconButton from '@components/IconButton'

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
    <div className="my-8 border-b border-b-gray-300 pb-8 print:break-after-page print:border-b-0 print:p-0 print:last:break-after-auto">
      <div className="flex w-full items-center gap-2 print:border-b print:border-b-gray-300 print:pb-2">
        <div className="flex-grow">
          <p
            className={classNames(
              ellipsisTextStyles,
              'text-lg print:text-xl print:font-bold'
            )}
          >
            {title}
          </p>
          <p
            className={classNames(ellipsisTextStyles, 'text-lg text-gray-400')}
          >
            {authors}
          </p>
        </div>
        {formattedKey && (
          <div className="rounded-3xl bg-gray-100 px-3 py-2 print:border print:border-black print:bg-transparent">
            {formattedKey}
          </div>
        )}
        {!!onOpenMenu && <IconButton icon={moreIcon} onClick={onOpenMenu} />}
      </div>
      {comment && (
        <p className="mt-2 whitespace-pre text-base print:m-4 print:rounded-lg print:border print:border-gray-400 print:p-2">
          {comment}
        </p>
      )}
      {body.map((part, index) => (
        <p
          className="m-0 h-0 overflow-hidden whitespace-pre font-mono text-base/snug print:my-5 print:h-auto print:break-inside-avoid-page print:overflow-auto"
          key={index}
        >
          {part}
        </p>
      ))}
    </div>
  )
}
