export function createDebouncer (interval, immediate) {
  let timeout

  return function (cb) {
    const context = this; const args = arguments
    const later = function () {
      timeout = null
      if (!immediate) cb.apply(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, interval)

    if (callNow) cb.apply(context, args)
  }
}
