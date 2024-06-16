export const newListener = (el: any, listener: string, f: (e: any) => void) => {
  el.addEventListener(listener, f)
}

export const stopEvent = (event: any) => {
  event.stopImmediatePropagation()
  event.stopPropagation()
  event.preventDefault()
}
