export function createDebouncer (interval:number, immediate = false) {
  let timeout: number

  return function (this, cb: () => void, ...args) {
    const later = function () {
      timeout = null
      if (!immediate) cb.apply(this, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, interval)

    if (callNow) cb.apply(this, args)
  }
}
