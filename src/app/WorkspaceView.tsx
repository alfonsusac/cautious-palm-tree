import { ReactNode } from "react"
import { useMouse } from "./use-mouse2"
import useTabFocus from "./use-active-tab"
import { handleZoom, handleZoomToCursor } from "./handle-zoom"
import { handlePanning } from "./use-pan"
import { useViewOffset } from "./use-view-offset"
import { translateX, translateY, translateZ } from "./translate"
import { useZoomRef } from "./ZoomContext"

export function WorkspaceView(
  props: {
    children?: ReactNode
  }
) {
  const view = useViewOffset()
  const tabFocus = useTabFocus()
  const zoomRef = useZoomRef()
  useMouse(mouse => {
    const zoom = handleZoom(mouse, view.zoom)
    if (zoom) { zoomRef.current = zoom.value }
    const movement = handlePanning(mouse, view.zoom, tabFocus.focused)
      .scale(view.zoom.inversedScale)
    if (zoom) {
      const deltaZoom = view.setZoom(zoom.value)
      const offset = handleZoomToCursor(mouse, deltaZoom)
      view.addPosition(offset)
    }
    view.addPosition(movement)
  })

  return (
    <div className="w-0 h-0 relative"
      style={{
        transform: `perspective(1px) ` + translateZ(view.zoom.scale) + translateX(view.position.x) + translateY(view.position.y)
      }}
    >
      <div className="w-screen h-screen absolute top-0 left-0 border border-dashed  border-neutral-700 bg-neutral-900/50" />

      {props.children}
    </div>
  )
}