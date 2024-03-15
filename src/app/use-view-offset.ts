import { useState } from "react"
import { Pos } from "./pos"
import { Zoom } from "./handle-zoom"

export function useViewOffset() {
  const [value, setValue] = useState({
    pos: new Pos(0, 0),
    zoom: new Zoom(0),
  })
  const setPosition =
    (newPos: (prev: Pos) => Pos) =>
      setValue(prev => ({ pos: newPos(prev.pos), zoom: prev.zoom }))
  const addPosition =
    (addition: Pos) =>
      setPosition(prev => prev.add(addition))
  const setZoom = (newZoom: Zoom) => {
    const deltaScale = newZoom.scale - value.zoom.scale
    setValue(prev => ({ pos: prev.pos, zoom: newZoom }))
    return deltaScale
  }

  return {
    position: value.pos,
    zoom: value.zoom,
    setPosition,
    addPosition,
    set: setValue,
    setZoom,
  }
}