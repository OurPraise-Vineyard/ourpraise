import React from 'react'
import styled from 'styled-components'

import moreIcon from '@assets/more-vertical.svg'
import Comment from '@components/EventComment'
import FlexGrow from '@components/FlexGrow'
import IconButton from '@components/IconButton'

const Container = styled.div`
  margin: 32px 0;

  @media print {
    padding: 0;
    box-shadow: none;
    &:not(:last-child) {
      page-break-after: always;
    }
  }

  @media screen {
    padding-bottom: 32px;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 8px;

  @media print {
    padding-bottom: 4px;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`

const SongTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;

  @media print {
    font-size: ${props => props.theme.fontSizes.large};
  }
`

const SongAuthors = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.textFaded};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  white-space: nowrap;

  @media print {
    font-size: ${props => props.theme.fontSizes.regular};
  }
`

const PlayKey = styled.div`
  padding: 10px 15px;
  border-radius: 22px;
  background-color: ${props => props.theme.colors.subtleButtonBackground};
  position: relative;
  border: 1px solid ${props => props.theme.colors.subtleButtonBorder};
  font-size: ${props => props.theme.fontSizes.small};
`

const SongBody = styled.div`
  font-family: 'Oxygen Mono', monospace;
  margin: 20px 0;
  white-space: pre;
  font-size: ${props => props.theme.fontSizes.small};
  page-break-inside: avoid;

  @media screen {
    height: 0;
    overflow: hidden;
    margin: 0;
  }
`

type SongListItemProps = {
  formattedKey?: string
  title: string
  body?: string[]
  authors: string
  comment?: string
}

export default function SongListItem({
  title,
  authors,
  formattedKey,
  body = [],
  comment
}: SongListItemProps) {
  return (
    <Container>
      <Header>
        <FlexGrow>
          <SongTitle>{title}</SongTitle>
          <SongAuthors>{authors}</SongAuthors>
        </FlexGrow>
        {formattedKey && <PlayKey>{formattedKey}</PlayKey>}
        <IconButton icon={moreIcon} />
      </Header>
      {comment && <Comment>{comment}</Comment>}
      {body.map((part, index) => (
        <SongBody key={index}>{part}</SongBody>
      ))}
    </Container>
  )
}
