export function getFunctionUrl (name, options) {
  let base
  if (window.location.origin.startsWith('http://localhost:')) {
    base = 'http://localhost:5001/ourpraise-fb/europe-west1/'
  } else {
    base = 'https://europe-west1-ourpraise-fb.cloudfunctions.net/'
  }

  const optionsUrl = encodeURI(Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join('&'))

  return `${base}${name}?${optionsUrl}`
}
