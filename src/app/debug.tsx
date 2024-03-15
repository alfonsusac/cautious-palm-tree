import { useRef } from "react"
import { useMouse } from "./use-mouse2"
import { useEventListener } from "./use-event-listener"
// import { useDragContext, useDragRegion } from "./DragContext"
import { useApp } from "./AppComponent"
import { round } from "./util"
import { useRerender } from "./use-rerender"

export function CenterDot() {
  return (
    <div className="bg-red-500 rounded-full absolute w-2 h-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />
  )
}

export function ZoomDebug() {
  // console.log("Hello")

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const { positionDelta, position } = useMouse((mouse) => {
    if (!ref1.current) return
    ref1.current.style.transform = `translateX(${ mouse.positionDelta.x }px) translateY(${ mouse.positionDelta.y }px)`
    if (!ref2.current) return
    const scrollEv = mouse.event as WheelEvent
    ref2.current.style.transform = `translateY(${ scrollEv.deltaY }px) translateX(${ scrollEv.deltaX }px)`
  })

  const { viewport, drag } = useApp()



  return (
    <div className="text-xs">
      <div>
        Drag: id:{drag.context.value?.id} | pos:{drag.context.value?.initialPosition + ''}<br />
        Region: {drag.region.value + ''}<br />
      </div>
      <div className="relative w-40 h-40 bg-white/20 z-40 border border-white text-nowrap text-xs">
        {positionDelta + ''} <br />
        {position + ''} <br />
        <div
          className="w-1 h-1 rounded-full bg-red-500 absolute top-1/2 left-1/2"
          ref={ref1}
        >
        </div>
        <div
          className="w-1 h-1 rounded-full bg-blue-500 absolute top-1/2 left-1/2"
          ref={ref2}
        >
        </div>
      </div>
      <div>
        Zoom Scale: {round(viewport.zoom.scale)} <br />
        Zoom Factor: {round(viewport.zoom.factor)} <br />
        Zoom Factor: {round(viewport.zoom.inversedScale)} <br />
        View Offset: {viewport.position + ''} < br />
      </div>
    </div>

  )
}