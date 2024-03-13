import { CustomMouseEventPayload } from "./use-mouse2"
import { Pos } from "./pos"

export function handleZoom(
  mouse: CustomMouseEventPayload,
  currentZoom: Zoom
) {
  if (
    !("deltaY" in mouse.event)
    || (!mouse.event.metaKey && !mouse.event.ctrlKey)
  ) return
  
  const minZoom = 0.5 // 200%
  const maxZoom = -4 // 20%
  const newZoomScale =
    Math.max(
      Math.min(
        currentZoom.scale - mouse.scrollDelta / 200,
        minZoom
      ),
      maxZoom
    )
  const newZoomDelta = newZoomScale - currentZoom.scale
  return {
    value: new Zoom(newZoomScale),
    delta: newZoomDelta,
  }
}

export function handleZoomToCursor(
  mouse: CustomMouseEventPayload,
  deltaZoom: number
) {
  const screenCenter = new Pos(window.innerWidth / 2, window.innerHeight / 2)
  const cursorDistanceFromCenter = mouse.position.subtract(screenCenter)
  const zoomPositionOffset = cursorDistanceFromCenter.scale(deltaZoom)
  return zoomPositionOffset.scale(-1)
}

export class Zoom {
  scale: number
  constructor(transformZValue: number = 0) {
    this.scale = transformZValue
  }
  get factor() { return (1 / (1 - this.scale)) }
  get inversedScale() { return (1 - this.scale) }
}
