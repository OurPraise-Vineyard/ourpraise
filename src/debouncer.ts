export function createDebouncer (interval:number, immediate = false) {
  let timeout:NodeJS.Timeout

  return function (this: void, cb:() => void) {
    const context:void = this
		const args = Array.from(arguments)

    const later = function () {
      timeout = null
      if (!immediate) cb.apply<void, any[], void>(context, args)
    }

    const callNow = immediate && !timeout

    clearTimeout(timeout)
    timeout = setTimeout(later, interval)

    if (callNow) cb.apply<void, any[], void>(context, args)
  }
}
