const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export default function pruneObject(obj) {
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
