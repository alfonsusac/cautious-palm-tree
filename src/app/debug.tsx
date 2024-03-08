import { useRef } from "react"
import { useMouse } from "./use-mouse2"
import { useZoom } from "./use-zoom"

export function MouseDebug() {
  return (
    <div>

    </div>
  )
}

export function CenterDot() {
  return (
    <div className="bg-red-500 rounded-full absolute w-2 h-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50" />
  )
}

export function ZoomDebug() {

  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const { } = useMouse((mouse) => {
    if(!ref1.current) return
    ref1.current.style.transform = `translateX(${mouse.positionDelta.x}px) translateY(${mouse.positionDelta.y}px)`
    if (!ref2.current) return
    // console.log(mouse.scrollDelta)
    ref2.current.style.transform = `translateY(${ mouse.scrollDelta }px)`
  })

  const zoom = useZoom()

  return (
    <div className="relative w-40 h-40 bg-white/20 z-40 border border-white">
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
      <div>
        {zoom.zoom}
      </div>
      <div>
        { 100/(1-zoom.zoom)}
      </div>
    </div>
  )
}

function Dot() {
  
  return (
    <div className="">

    </div>
  )
}