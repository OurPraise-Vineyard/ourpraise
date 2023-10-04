import React from 'react'
import styled from 'styled-components'
import x from '@assets/x.svg'
import SelectField from '@components/SelectField'
import { keysOptions } from '@utils/chords'
import TextField from '@components/TextField'

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
  font-size: 20px;
  font-weight: bold;
  grid-area: title;
  align-self: end;
`

const SongAuthors = styled.div`
  font-size: 18px;
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

export default function FormSongItem ({ song, onChangeTranspose, onChangeComment, onRemove }) {
  return (
    <Container>
      <SongTitle>{song.title}</SongTitle>
      <SongAuthors>{song.authors}</SongAuthors>
      <RemoveButton onClick={onRemove} />
      <SelectWrapper>
        <SelectField
          value={song.transposeKey}
          title="Song Key"
          onChange={e => onChangeTranspose(e.target.value)}
          options={keysOptions}
        />
      </SelectWrapper>
      <CommentWrapper>
        <TextField
          multiline
          size="small"
          value={song.comment}
          onChange={e => onChangeComment(e.target.value)}
          title="Comment"
        />
      </CommentWrapper>
    </Container>
  )
}
