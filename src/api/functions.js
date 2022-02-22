export function getFunctionUrl (name, options) {
  let base
  if (window.location.origin.startsWith('http://localhost:')) {
    base = 'http://localhost:5001/songdriver-firebase/europe-west1/'
  } else {
    base = 'https://europe-west1-songdriver-firebase.cloudfunctions.net/'
  }

  const optionsUrl = encodeURI(Object.entries(options)
    .map(([key, value]) => `${key}=${value}`)
    .join('&'))

  return `${base}${name}?${optionsUrl}`
}
