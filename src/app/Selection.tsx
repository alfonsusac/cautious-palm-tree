import { translateX, translateY } from "./translate"
import { useDragContext, useDragRegion } from "./DragContext"
import { useEffect } from "react"


export function SelectionBox() {
  const { context } = useDragContext()
  const region = useDragRegion()
  

  if (!region || context?.id !== "background") return null
  return (
    <div
      className="fixed z-10 inset-0 w-full h-full border-[0.1rem] rounded-md border-blue-500 bg-blue-500/20 text-white select-none"
      style={{
        width: region.width,
        height: region.height,
        transform: translateX(region.x) + translateY(region.y)
      }}
    >
    </div>
  )
}