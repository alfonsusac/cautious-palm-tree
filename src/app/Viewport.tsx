import { EventListener } from "./EventListener"
import { Zoom, handleZoom, handleZoomToCursor } from "./handle-zoom"
import { Pos } from "./pos"
import { Tab } from "./use-active-tab"
import { Mouse } from "./use-mouse3"
import { handlePanning } from "./use-pan"

export class Viewport {
  position = new Pos(0, 0)
  zoom = new Zoom(0)
  onChange = new EventListener<{ position: Pos, zoom: Zoom }>

  useInit() {
    // how to ensure that this runs once per component?
    Mouse.onMouseUpdate.do(mouse => {
      const zoom = handleZoom(mouse, this.zoom)
      const movement = handlePanning(mouse, this.zoom, Tab.focused)
        .scale(this.zoom.inversedScale)
      if (zoom) {
        const deltaZoom = this.setZoom(zoom.value)
        const offset = handleZoomToCursor(mouse, deltaZoom)
        this.addPosition(offset)
      }
      if (!movement.isZero) {
        this.addPosition(movement)
      }
    })
  }

  emit() {
    this.onChange.emit({ position: this.position, zoom: this.zoom })
  }
  setPosition(newPos: (prev: Pos) => Pos) {
    this.position = newPos(this.position)
    this.emit()
  }
  addPosition(addition: Pos) {
    this.position = this.position.add(addition)
    this.emit()
  }
  setZoom(newZoom: Zoom) {
    const deltaScale = newZoom.scale - this.zoom.scale
    this.zoom = newZoom
    this.emit()
    return deltaScale
  }
}