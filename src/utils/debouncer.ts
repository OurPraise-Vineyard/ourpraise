export function createDebouncer(interval: number) {
  let timeout: number

  return function (this, cb: () => void, immediate = false) {
    const later = function () {
      timeout = null
      if (!immediate) cb.apply(this)
    }

    const callNow = immediate

    clearTimeout(timeout)
    timeout = setTimeout(later, interval)

    if (callNow) cb.apply(this)
  }
}
