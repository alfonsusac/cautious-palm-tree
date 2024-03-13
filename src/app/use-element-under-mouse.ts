import { RefObject, useEffect, useState } from "react"
import { useMouse } from "./use-mouse2"

export function useElementUnderMouse(
  isElementUnderHouse?: (id: string) => void
) {

  const [elementIdUnderMouse, setElementIdUnderMouse] = useState<string>()
  const { position } = useMouse()
  useEffect(() => {
    if (position) {
      const el = document.elementFromPoint(position.x, position.y)
      if (!el) return
      setElementIdUnderMouse(el.id)
      isElementUnderHouse?.(el.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position])

  return {
    elementIdUnderMouse: elementIdUnderMouse === "" ? undefined : elementIdUnderMouse,
  }
}