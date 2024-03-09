import { useState } from "react"
import { useEventListener } from "./use-event-listener"

export function useKeyPress(key: string) {
  const [pressed, setPressed] = useState(false)
  const [event, setEvent] = useState<KeyboardEvent>()
  useEventListener(
    'keydown',
    (e) => {
      if (e.key === key) {
        setPressed(true)
        setEvent(e)
      }
    }
  )
  useEventListener(
    'keyup',
    (e) => {
      if (e.key === key) {
        setPressed(false)
        setEvent(e)
      }
    })
  return {
    pressed,
    event
  }
}