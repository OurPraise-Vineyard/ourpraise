import React from 'react'
import styled from 'styled-components'

import Comment from '@features/Events/Event/Comment'

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
  display: grid;
  grid-template-columns: minmax(0, 3fr) 1fr;
  grid-template-rows: repeat(4, min-content);
  grid-template-areas: 'title key' 'authors key';

  @media print {
    padding-bottom: 4px;
    border-bottom: 1px solid ${props => props.theme.colors.breaker};
  }
`

const SongTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  font-weight: bold;
  grid-area: title;
  align-self: end;
  overflow: hidden;
  text-overflow: ellipsis;

  @media print {
    font-size: ${props => props.theme.fontSizes.large};
  }
`

const SongAuthors = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.textFaded};
  grid-area: authors;
  align-self: start;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  white-space: nowrap;

  @media print {
    font-size: ${props => props.theme.fontSizes.regular};
  }
`

const PlayKey = styled.div`
  grid-area: key;
  justify-self: end;
  align-self: start;
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
        <SongTitle>{title}</SongTitle>
        <SongAuthors>{authors}</SongAuthors>
        {formattedKey && <PlayKey>{formattedKey}</PlayKey>}
      </Header>
      {comment && <Comment>{comment}</Comment>}
      {body.map((part, index) => (
        <SongBody key={index}>{part}</SongBody>
      ))}
    </Container>
  )
}
