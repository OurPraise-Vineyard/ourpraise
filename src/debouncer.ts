export function createDebouncer (interval:number, immediate = false) {
  let timeout: number

  return function (this: void, cb:() => void) {
    const context:void = this
		const args = arguments

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
