const { transposeBody } = require('./chords')
const { formatDate } = require('./date')

function createSongHtml (song, transpose) {
  const body = transposeBody(transpose, song.body)
  const width = Math.max(...body.split('\n').map(line => line.length))
  const columns = width > 34 ? 1 : 2

  let finalBody = body

  if (columns === 2) {
    const commentLines = song.comment ? song.comment.split('\n').length : 0
    let commentHeight = Math.ceil((24 + 12 * commentLines) / 11)

    const bodyColumns = [
      {
        count: 0,
        parts: []
      }
    ]
    body.split('\n\n').forEach(part => {
      let current = bodyColumns[bodyColumns.length - 1]
      const linesInPart = part.split('\n').length + 1
      if (linesInPart + current.count > 45 - commentHeight) {
        bodyColumns.push({
          count: 0,
          parts: []
        })
        current = bodyColumns[bodyColumns.length - 1]

        if (bodyColumns.length > 2) {
          commentHeight = 0
        }
      }

      current.parts.push(part)
      current.count += linesInPart
    })

    finalBody = `<div class="columns">${bodyColumns
      .map(
        ({ parts }, index) =>
          `${
            index % 2 === 0 && index > 0 ? '<div class="break"></div>' : ''
          }<p class="body column">${parts.join('\n\n')}</p>`
      )
      .join('\n\n')}</div>`
  }

  return `
    <div class="song">
      <h1 class="heading">${song.title}</h1>
      <h2 class="subheading">${song.authors}</h2>
      ${!!song.comment ? `<p class="comment">${song.comment}</p>` : ''}
    ${
      columns === 1
        ? `<p class="body">${body
            .split('\n\n')
            .map(part => `<span class="body-part">${part}</span>`)
            .join('\n')}</p>`
        : finalBody
    }
    </div>
  `
}

function renderFrontPage (event, songs) {
  if (!event) {
    return ''
  }

  return `
    <div class="frontpage">
      <h1 class="heading">${event.title}</h1>
      <h2 class="subheading">
        <span class="align-right">${formatDate(event.date)}</span>
      </h2>
      <ul>
        ${songs.map(song => `<li>${song.title}, ${song.authors}</li>`).join('')}
      </ul>
      ${event.comment ? `<p class="comment">${event.comment}</p>` : ''}
    </div>
  `
}

module.exports = function createHtml (songs, event) {
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
  margin: 0 0 16px;
}
.subheading::after {
  content: "";
  display: table;
  clear: both;
}

.columns::after {
  content: "";
  display: table;
  clear: both;
}

.column {
  width: 50%;
  float: left;
  margin: 0;
}

.break {
  page-break-before: always;
}

.frontpage {
  page-break-after: always;
}

.align-right {
  float: right;
}

ul {
  font-size: 12px;
  line-height: 1.5;
  font-family: 'Roboto';
  font-weight: normal;
  margin: 24px 0;
}

li {
  margin-bottom: 5px;
}

.comment {
  border-radius: 10px;
  padding: 8px;
  border: 1px solid #aaa;
  margin: 16px 0;

  font-size: 12px;
  line-height: 1.5;
  font-family: 'Roboto';
  font-weight: normal;

  white-space: pre;
}
</style>
    </head>
      <body>
        ${renderFrontPage(event, songs)}
        ${songs.map(song => createSongHtml(song, song.transpose)).join('')}
      </body>
    </html>
  `
}
