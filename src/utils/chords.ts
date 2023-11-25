import { Transposer } from 'chord-transposer'

const keys: IKey[][] = [
  ['C'],
  ['Db'],
  ['D'],
  ['Eb'],
  ['E'],
  ['F'],
  ['Gb', 'F#'],
  ['G'],
  ['Ab'],
  ['A'],
  ['Bb'],
  ['B']
]

export const keysOptions: { value: string; label: string }[] = [
  {
    value: 'C',
    label: 'C / Am'
  },
  {
    value: 'Db',
    label: 'Db / Bbm'
  },
  {
    value: 'D',
    label: 'D / Bm'
  },
  {
    value: 'Eb',
    label: 'Eb / Cm'
  },
  {
    value: 'E',
    label: 'E / C#m'
  },
  {
    value: 'F',
    label: 'F / Dm'
  },
  {
    value: 'F#',
    label: 'F# / D#m'
  },
  {
    value: 'Gb',
    label: 'Gb / Ebm'
  },
  {
    value: 'G',
    label: 'G / Em'
  },
  {
    value: 'Ab',
    label: 'Ab / Fm'
  },
  {
    value: 'A',
    label: 'A / F#m'
  },
  {
    value: 'Bb',
    label: 'Bb / Gm'
  },
  {
    value: 'B',
    label: 'B / G#m'
  }
]

export function findNextKey(fromKey: string, steps: 1 | -1): IKey {
  const index = keys.findIndex(key =>
    key.some(keyVariant => keyVariant === fromKey)
  )
  return keys[(index + steps + keys.length) % keys.length][0]
}

export function transposeSong(
  body: string,
  fromKey: IKey | null,
  toKey: string
): string {
  const modifiedBody = body
    .replace(/\(/g, '{{START_PAREN}} ')
    .replace(/\)/g, ' {{END_PAREN}}')

  let transposedBody

  if (fromKey === null) {
    transposedBody = Transposer.transpose(modifiedBody).toKey(toKey).toString()
  } else {
    transposedBody = Transposer.transpose(modifiedBody)
      .fromKey(fromKey)
      .toKey(toKey)
      .toString()
  }

  return transposedBody
    .replace(/{{START_PAREN}}\s/g, '(')
    .replace(/(\s*)\s{{END_PAREN}}/g, (match, p1) => {
      return ')' + p1
    })
}
