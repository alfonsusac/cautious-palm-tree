import { Ref, RefObject, useContext, useEffect, useState } from "react"
import { Pos } from "./pos"
import { useMouse } from "./use-mouse2"
import { GlobalDragContext } from "./app"
import toast from "react-hot-toast"
import { useZoom } from "./use-zoom"
import { useElementUnderMouse } from "./use-element-under-mouse"

export function useMouseDrag<T extends HTMLElement>(
  target: RefObject<T>,
  onDrag: (delta: Pos) => void,
  onEnd: () => void,
  scale: number = 1,
) {
  const [dragging, setDragging] = useState(false)
  const { dragRef, setDragRef } = useContext(GlobalDragContext)

  const mouse = useMouse(() => { })
  const {
    leftClick,
    positionDelta,
    position: mousePos,
  } = mouse

  const { elementIdUnderMouse } = useElementUnderMouse()

  useEffect(() => {
    if (
      leftClick
      && !positionDelta.isZero
      && !dragging
      && mousePos
      && !dragRef
      && target.current
      && elementIdUnderMouse === target.current.id
    ) {
      if (target.current) {
        setDragging(true)
        setDragRef(target.current?.id)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftClick,
    positionDelta,
    dragging,
    mousePos,
    target,
    dragRef,
    setDragRef,
  ])

  useEffect(() => {
    if (leftClick === false && dragging) {
      setDragging(false)
      setDragRef(null)
      onEnd()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftClick, dragging, dragRef, setDragRef])

  const { zoomFactor, zoom } = useZoom()
  useEffect(() => {
    if (dragging && positionDelta) {
      onDrag(positionDelta.scale(1 / zoomFactor))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, positionDelta])

  return {
    dragging,
    ...mouse,
  }
}