const notes = 'C.D.EF.G.A.B'.split('')
const validKeys = /(Ab|A#|A|Bb|B#|B|Cb|C#|C|Db|D#|D|Eb|E#|E|Fb|F#|F|Gb|G#|G)/g

function parseChord (chord) {
  const root = chord[0]
  const mod = (chord[1] === '#' || chord[1] === 'b') ? chord.substr(2) : chord.substr(1)

  let initialIndex = notes.indexOf(root)

  if (chord[1] === '#') {
    initialIndex = (initialIndex + 1) % notes.length
  } else if (chord[1] === 'b') {
    initialIndex = (initialIndex - 1 + notes.length) % notes.length
  }

  if (initialIndex === -1) {
    console.error('Received strange chord: ' + chord)
    return
  }

  return [initialIndex, mod]
}

function getRelativeChord (chord, movement) {
  if (movement === 0) {
    return chord
  }

  const [initialIndex, mod] = parseChord(chord)

  const newIndex = (initialIndex + movement + notes.length) % notes.length

  if (notes[newIndex] === '.') {
    const prevIndex = (newIndex - movement / Math.abs(movement) + notes.length) % notes.length
    if (movement < 0) {
      return notes[prevIndex] + 'b' + mod
    } else {
      return notes[prevIndex] + '#' + mod
    }
  }

  return notes[newIndex] + mod
}

exports.transposeBody = function transposeBody (transpose, body) {
  const lines = body.split('\n')

  return lines
    .map(line => {
      if (line.substr(0, 2) === '//') {
        return line
          .replace(/^\/\//, '  ')
          .replace(
            validKeys,
            (chord) => getRelativeChord(chord, transpose)
          )
      }

      return line
    })
    .join('\n')
}
