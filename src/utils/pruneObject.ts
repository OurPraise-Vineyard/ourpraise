const isObject = (obj: object): boolean => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export default function pruneObject(
  obj: Record<string, any>
): Record<string, any> {
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
