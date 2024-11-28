import { findNextKey, keysOptions, transposeSong } from './chords'

const songF = `// Dm7 Bb
We say these dry bones, dry bones
// F C
They will live again`

const songGb = `// Ebm7 Cb
We say these dry bones, dry bones
// Gb Db
They will live again`

const songD = `// Bm7 G
We say these dry bones, dry bones
// D A
They will live again`

test('work without specified key', () => {
  expect(transposeSong(songF, null, 'Gb')).toStrictEqual(songGb)
})

test('correct transpose F->Gb', () => {
  expect(transposeSong(songF, 'F', 'Gb')).toStrictEqual(songGb)
})

test('correct transpose F->D', () => {
  expect(transposeSong(songF, 'F', 'D')).toStrictEqual(songD)
})

test('only transpose chords', () => {
  expect(
    transposeSong(
      `[Chorus]
// A G#-F#
A line should not be changed`,
      'A',
      'G'
    )
  ).toStrictEqual(`[Chorus]
// G F#-E
A line should not be changed`)
})

test('find key above', () => {
  expect(findNextKey('F', 1)).toStrictEqual('Gb')
  expect(findNextKey('C', 1)).toStrictEqual('Db')
  expect(findNextKey('Eb', 1)).toStrictEqual('E')
})

test('find key below', () => {
  expect(findNextKey('G', -1)).toStrictEqual('Gb')
  expect(findNextKey('D', -1)).toStrictEqual('Db')
  expect(findNextKey('F#', -1)).toStrictEqual('F')
})

test('correct number of key options', () => {
  expect(keysOptions.length).toEqual(13)
})

test('transpose chords in parentheses', () => {
  expect(
    transposeSong(
      `// (F#) E   B       F#
Han er god hver en dag`,
      'B',
      'Db'
    )
  ).toStrictEqual(`// (Ab) Gb  Db      Ab
Han er god hver en dag`)
})

test('distribute spaces when transposing chords in parentheses', () => {
  expect(
    transposeSong(
      `// (F#) E   B       F#
Han er god hver en dag`,
      'B',
      'C'
    )
  ).toStrictEqual(`// (G)  F   C       G
Han er god hver en dag`)
})
