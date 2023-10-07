const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function pruneObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
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
  }, {})
}

export function sortByTitleAsc(a, b) {
  if (a.title < b.title) {
    return -1
  } else if (a.title > b.title) {
    return 1
  }
  return 0
}
