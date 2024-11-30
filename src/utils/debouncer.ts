export function createDebouncer(interval: number) {
  let timeout: number

  return function (this: any, cb: () => void, immediate = false) {
    const later = function () {
      if (!immediate) cb()
    }

    const callNow = immediate

    clearTimeout(timeout)
    timeout = window.setTimeout(later, interval)

    if (callNow) cb()
  }
}
