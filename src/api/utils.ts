export function mapDocsId (snap, idField = 'id') {
  return snap.docs.map(doc => ({ ...doc.data(), [idField]: doc.id }))
}

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function pruneObject (obj) {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        if (isObject(value)) {
          return {
            ...acc,
            [key]: pruneObject(value)
          }
        }

        return {
          ...acc,
          [key]: value
        }
      }
      return acc
    },
    {}
  )
}

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
