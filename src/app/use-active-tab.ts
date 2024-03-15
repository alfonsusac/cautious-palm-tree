import { useEffect, useState } from "react"
import { EventListener } from "./EventListener"
import { useEventListener } from "./use-event-listener"

export const Tab = {
  focused: true,
  onFocusChange: new EventListener<boolean>,
  useHooks() {
    const tab = this
    function handleFocusEvent() {
      tab.focused = true
      tab.onFocusChange.emit(tab.focused)
    }
    function handleBlurEvent() {
      tab.focused = false
      tab.onFocusChange.emit(tab.focused)
    }
    useEventListener("focus", handleFocusEvent)
    useEventListener("blur", handleBlurEvent)
  }
}


export default function useTabFocus() {

  const [focused, setFocused] = useState(true)

  useEffect(() => {
    function handleFocusEvent() {
      setFocused(true)
    }
    function handleBlurEvent() {
      setFocused(false)
    }
    window.addEventListener("focus", handleFocusEvent)
    window.addEventListener("blur", handleBlurEvent)
    return () => {
      window.removeEventListener("focus", handleFocusEvent)
      window.removeEventListener("blur", handleBlurEvent)
    }
  })
  return {
    focused
  }
}