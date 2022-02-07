const { transposeBody } = require('./chords')

function createSongHtml (song, transpose) {
  const body = transposeBody(transpose, song.body)
  const width = Math.max(...body.split('\n').map(line => line.length))
  const columns = width > 34 ? 1 : 2

  let finalBody = body

  if (columns === 2) {
    const bodyColumns = [{
      count: 0,
      parts: []
    }]
    body.split('\n\n').forEach(part => {
      let current = bodyColumns[bodyColumns.length - 1]
      const linesInPart = part.split('\n').length + 1
      if (linesInPart + current.count > 45) {
        bodyColumns.push({
          count: 0,
          parts: []
        })
        current = bodyColumns[bodyColumns.length - 1]
      }

      current.parts.push(part)
      current.count += linesInPart
    })

    finalBody = `<div class="columns">${bodyColumns.map(({ parts }, index) => `${(index % 2) === 0 && index > 0 ? '<div class="break"></div>' : ''}<p class="body column">${parts.join('\n\n')}</p>`).join('\n\n')}</div>`

    console.log(finalBody)
  }

  return `
    <div class="song">
      <h1 class="heading">${song.title}</h1>
      <h2 class="subheading">${song.authors}</h2>
    ${columns === 1
      ? `<p class="body">${body
        .split('\n\n')
        .map(part => `<span class="body-part">${part}</span>`)
        .join('\n')}</p>`
    : finalBody}
    </div>
  `
}

module.exports = function createHtml(songs) {
  return `
    <html>
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oxygen+Mono&family=Roboto:wght@400;700&display=swap" rel="stylesheet">

<style>
.song:not(:last-child) {
  page-break-after: always;
}

.body {
  font-family: 'Oxygen Mono';
  font-size: 11px;
  white-space: pre;
}

.body-part {
  page-break-inside: avoid;
  display: block;
}

.heading {
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 18px;
  margin: 0;
}

.subheading {
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 14px;
  color: #aaa;
  line-height: 1.5;
  border-bottom: 1px solid #ddd;
  margin: 0 0 20px;
}
.columns::after {
  content: "";
  display: table;
  clear: both;
}

.column {
  width: 50%;
  float: left;
}

.break {
  page-break-before: always;
}
</style>
    </head>
      <body>
        ${songs.map(song => createSongHtml(song, song.transpose)).join('')}
      </body>
    </html>
  `
}
