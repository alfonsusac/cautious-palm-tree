import { ReactNode, useEffect, useRef, useState } from "react"
import { Pos } from "./pos"
import { useMouse, useMouseEventListener } from "./use-mouse2"
import toast from "react-hot-toast"
import useTabFocus from "./use-active-tab"
import { useMouseDrag } from "./use-mouse-drag"
import { useZoom } from "./use-zoom"



export function Workspace(
  props: {
    children?: ReactNode
  }
) {

  const [viewOffset, setViewOffset] = useState(new Pos(0, 0))
  const [dragging, setDragging] = useState(false)
  const { isTabFocused } = useTabFocus()

  // const [zoom, setZoom] = useState(0)
  // const [zoomDelta, setZoomDelta] = useState(0)

  const { zoom, zoomDelta } = useZoom()

  const {
    middleClick,
    positionDelta,
    position
  } = useMouse((mouse) => {
    // setZoom(prev => {
    //   const minZoom = 0.5 // 200%
    //   const maxZoom = -4 // 20%

    //   const scrollStep = 1 // Fixed scroll step size
    //   const zoomOutFactor = 0.02 // Percentage decrease per scroll step when zooming out
    //   const zoomInFactor = 0.02 // Percentage increase per scroll step when zooming in

    //   // Determine the scaling factor based on the direction of the zoom
    //   const scaleFactor = mouse.scrollDelta < 0 ? (1 + zoomInFactor * scrollStep) : (1 - zoomOutFactor * scrollStep)
    //   let newZoom = prev - mouse.scrollDelta / 1200

    //   newZoom = Math.min(newZoom, minZoom)
    //   newZoom = Math.max(newZoom, maxZoom)

    //   const newZoomDelta = newZoom - prev
    //   setZoomDelta(newZoomDelta)
    //   return newZoom
    // })
  })

  // Side effect to dragging.
  useEffect(() => {
    if (!dragging && middleClick && isTabFocused) {
      setDragging(true)
    }
    if (dragging && !middleClick) {
      setDragging(false)
    }
    if (dragging && middleClick) {
      setViewOffset(prev => prev.add(positionDelta))
    }
  }, [middleClick, dragging, positionDelta, isTabFocused])


  // Zoom rarely does some weird jerk to the side but 
  // . i can't seem to figure what is causing that.
  useEffect(() => {
    if(!position) return
    const screenCenter = new Pos(
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    const distFromCenter = position.subtract(screenCenter)
    const zoomPositionOffset = distFromCenter.scale(zoomDelta)
    const newoffset = viewOffset.subtract(zoomPositionOffset)
    setViewOffset(newoffset)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])


  const workspaceRef = useRef<HTMLDivElement>(null)
  const { } = useMouseDrag(
    workspaceRef,
    new Pos(0, 0),
    () => { },
    () => { },
  )

  return (
    <div
      id="Workspace"
      ref={workspaceRef}
      className="bg-neutral-900/50 w-screen h-screen relative border border-white"
      style={{
        transform: `perspective(1px) translateZ(${ zoom }px) translateX(${ viewOffset.x }px) translateY(${ viewOffset.y }px)`,
      }}
    >
      {props.children}
    </div>
  )
}