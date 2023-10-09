export default function getSearchParam(key) {
  const reg = new RegExp(`\\?.*${key}=([\\w\\d.@]*).*$`)
  const match = window.location.search.match(reg)

  if (match) {
    return match[1]
  }

  return ''
}
