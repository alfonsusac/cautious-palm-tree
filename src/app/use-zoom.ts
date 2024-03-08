import { useState } from "react"
import { useMouse } from "./use-mouse2"

export function useZoom() {

  const [zoom, setZoom] = useState(0)
  const [zoomDelta, setZoomDelta] = useState(0)

  const {

  } = useMouse(mouse => {
    setZoom(prev => {
      const minZoom = 0.5 // 200%
      const maxZoom = -4 // 20%
      const scrollStep = 1 // Fixed scroll step size
      const zoomOutFactor = 0.02 // Percentage decrease per scroll step when zooming out
      const zoomInFactor = 0.02 // Percentage increase per scroll step when zooming in

      // Determine the scaling factor based on the direction of the zoom
      const scaleFactor = mouse.scrollDelta < 0 ? (1 + zoomInFactor * scrollStep) : (1 - zoomOutFactor * scrollStep)
      let newZoom = prev - (mouse.scrollDelta / 1200)
      newZoom = Math.min(newZoom, minZoom)
      newZoom = Math.max(newZoom, maxZoom)
      const newZoomDelta = newZoom - prev
      setZoomDelta(newZoomDelta)
      return newZoom
    })
  })

  // useEffect(() => {
  //   if (!position) return
  //   const screenCenter = new Pos(
  //     window.innerWidth / 2,
  //     window.innerHeight / 2
  //   )
  //   const distFromCenter = position.subtract(screenCenter)
  //   const zoomPositionOffset = new Pos(
  //     distFromCenter.x * zoomDelta,
  //     distFromCenter.y * zoomDelta
  //   )
  //   setViewOffset(prev => {
  //     const newOffsetX = prev.x - zoomPositionOffset.x
  //     const newOffsetY = prev.y - zoomPositionOffset.y
  //     return new Pos(newOffsetX, newOffsetY)
  //   })
  // }, [zoom])

  return {
    zoom, zoomDelta
  }

}

