import { useState } from "react"
import { useEventListener } from "./use-event-listener"

export function useKeyPress(key: string) {
  const [pressed, setPressed] = useState(false)
  useEventListener(
    'keydown',
    (e) => {
      if (e.key === key) {
        setPressed(true)
      }
    }
  )
  useEventListener('keyup', (e) => {
    if (e.key === key) {
      setPressed(false)
    }
  })
  return pressed
}