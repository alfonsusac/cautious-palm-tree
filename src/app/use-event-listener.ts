import { useEffect } from "react"

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    window.addEventListener(type, handler, options)
    return () => {
      window.removeEventListener(type, handler)
    }
  }, [handler, type, options])
}