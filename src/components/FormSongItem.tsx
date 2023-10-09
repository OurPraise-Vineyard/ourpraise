import React from 'react'
import styled from 'styled-components'

import x from '@assets/x.svg'
import SelectField from '@components/form/SelectField'
import TextArea from '@components/form/Textarea'
import { keysOptions } from '@utils/chords'

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: repeat(4, min-content);
  grid-template-areas: 'title actions' 'authors actions' 'key key' 'comment comment';
  padding: 10px 0;
  margin: 20px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`

const SongTitle = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  font-weight: bold;
  grid-area: title;
  align-self: end;
`

const SongAuthors = styled.div`
  font-size: ${props => props.theme.fontSizes.regular};
  color: ${props => props.theme.colors.textFaded};
  grid-area: authors;
  align-self: start;
`

const RemoveButton = styled.button`
  margin: 0 10px;
  grid-area: actions;
  justify-self: end;
  align-self: center;
  width: 20px;
  height: 20px;
  background-image: url(${x});
  background-repeat: no-repeat;
  background-position: center;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
`

const SelectWrapper = styled.div`
  grid-area: key;
  margin-top: 10px;
`

const CommentWrapper = styled.div`
  grid-area: comment;
  margin-top: 10px;
`

type FormSongItemProps = {
  song: ISong | IEventSong
  transposeKey: IKey
  comment: string
  onChangeTransposeKey: (IKey) => void
  onChangeComment: (string) => void
  onRemove: () => void
  showSongOptions?: boolean
}
export default function FormSongItem({
  song,
  transposeKey,
  comment,
  onChangeTransposeKey,
  onChangeComment,
  onRemove,
  showSongOptions
}: FormSongItemProps) {
  return (
    <Container>
      <SongTitle>{song.title}</SongTitle>
      <SongAuthors>{song.authors}</SongAuthors>
      <RemoveButton onClick={onRemove} />
      {showSongOptions && (
        <>
          <SelectWrapper>
            <SelectField
              value={transposeKey}
              title="Song Key"
              onChange={onChangeTransposeKey}
              options={keysOptions}
            />
          </SelectWrapper>
          <CommentWrapper>
            <TextArea
              size="small"
              value={comment}
              onChange={onChangeComment}
              title="Comment"
            />
          </CommentWrapper>
        </>
      )}
    </Container>
  )
}
