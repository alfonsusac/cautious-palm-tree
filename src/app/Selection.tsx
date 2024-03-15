import { translateX, translateY } from "./translate"
// import { useDragContext, useDragRegion } from "./DragContext"
import { useEffect } from "react"
import { useApp } from "./AppComponent"
import { useRerender } from "./use-rerender"


export function SelectionBox() {
  // const { context } = useDragContext()
  // const region = useDragRegion()

  const render = useRerender()
  const { drag } = useApp()
  drag.context.do(render)
  drag.region.do(render)

  if (!drag.region.value || drag.context.value?.id !== "background") return null
  return (
    <div
      className="fixed z-10 inset-0 w-full h-full border-[0.1rem] rounded-md border-blue-500 bg-blue-500/20 text-white select-none"
      style={{
        width: drag.region.value.width,
        height: drag.region.value.height,
        transform: translateX(drag.region.value.x) + translateY(drag.region.value.y)
      }}
    >
    </div>
  )
}