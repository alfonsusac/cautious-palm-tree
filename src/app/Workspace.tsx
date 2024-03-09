import { ReactNode, useEffect, useRef, useState } from "react"
import { Pos } from "./pos"
import { useMouse, useMouseEventListener } from "./use-mouse2"
import toast from "react-hot-toast"
import useTabFocus from "./use-active-tab"
import { useMouseDrag } from "./use-mouse-drag"
import { useZoom } from "./use-zoom"
import { useEventListener } from "./use-event-listener"



export function Workspace(
  props: {
    children?: ReactNode
  }
) {

  const [viewOffset, setViewOffset] = useState({ pos: new Pos(0, 0), zoom: 0 })
  const setViewPosition = (newPos: Pos) => setViewOffset(prev => ({ pos: newPos, zoom: prev.zoom }))
  const addViewPosition = (addition: Pos) => setViewPosition(viewOffset.pos.add(addition))
  const setViewZoom = (newZoom: number) => setViewOffset(prev => ({ pos: prev.pos, zoom: newZoom }))

  const [dragging, setDragging] = useState(false)
  const { isTabFocused } = useTabFocus()

  const { zoom, zoomDelta } = useZoom()

  const {
    middleClick,
    positionDelta,
    position
  } = useMouse((mouse) => {

  })

  const { zoomFactor } = useZoom()

  // Side effect to dragging.
  useEffect(() => {
    if (!dragging && middleClick && isTabFocused) {
      setDragging(true)
      document.body.style.cursor = 'grab'
    }
    if (dragging && !middleClick) {
      setDragging(false)
      document.body.style.cursor = 'auto'
    }
    if (dragging && middleClick) {
      const scaledPositionOffset = positionDelta.scale(1 / zoomFactor)
      addViewPosition(scaledPositionOffset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [middleClick, dragging, positionDelta, isTabFocused])

  useEffect(() => {
    if (!position) return
    const screenCenter = new Pos(
      window.innerWidth / 2,
      window.innerHeight / 2
    )
    const distFromCenter = position.subtract(screenCenter)
    const zoomPositionOffset = distFromCenter.scale(zoomDelta)
    const newoffset = viewOffset.pos.subtract(zoomPositionOffset)
    setViewOffset({ pos: newoffset, zoom })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom])

  const workspaceRef = useRef<HTMLDivElement>(null)
  const { } = useMouseDrag(
    () => { },
    () => { },
  )

  useEventListener('wheel', (e) => {
    if (!e.deltaX) return
    console.log("Hellos")
    const trackpadMovement = new Pos(-e.deltaX, -e.deltaY)
    const scaledMovement = trackpadMovement.scale(1 / zoomFactor)
    setViewPosition(viewOffset.pos.add(scaledMovement))
  })

  return (
    <div
      id="Workspace"
      ref={workspaceRef}
      className="bg-neutral-900/50 w-screen h-screen relative border border-white"
      style={{
        transform: `perspective(1px) translateZ(${ viewOffset.zoom }px) translateX(${ viewOffset.pos.x }px) translateY(${ viewOffset.pos.y }px)`,
      }}
    >
      {props.children}
    </div>
  )
}