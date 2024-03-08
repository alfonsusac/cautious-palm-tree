import { useEffect, useState } from "react"
import { useMouse } from "./use-mouse2"
import { Pos } from "./pos"

export function useZoom(
  // onZoom: () => {

  // }
) {

  const [zoom, setZoom] = useState(0)
  const [zoomDelta, setZoomDelta] = useState(0)
  const zoomFactor = (1 / (1 - zoom))

  const {
    position
  } = useMouse(mouse => {
    setZoom(prev => {
      const minZoom = 0.5 // 200%
      const maxZoom = -4 // 20%
      const scrollStep = 1 // Fixed scroll step size
      const zoomOutFactor = 0.02 // Percentage decrease per scroll step when zooming out
      const zoomInFactor = 0.02 // Percentage increase per scroll step when zooming in

      // Determine the scaling factor based on the direction of the zoom
      const scaleFactor = mouse.scrollDelta < 0 ? (1 + zoomInFactor * scrollStep) : (1 - zoomOutFactor * scrollStep)
      if (mouse.scrollDelta === 0) return prev
      let newZoom = prev - (mouse.scrollDelta < 0 ? -0.1 : 0.1)
      newZoom = Math.min(newZoom, minZoom)
      newZoom = Math.max(newZoom, maxZoom)
      const newZoomDelta = newZoom - prev
      setZoomDelta(newZoomDelta)
      return newZoom
    })
  })

  return {
    zoom,
    zoomDelta,
    zoomFactor,
  }
}

