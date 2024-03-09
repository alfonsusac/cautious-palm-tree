import { useContext, useEffect, useState } from "react"
import { Pos } from "./pos"
import { useMouse } from "./use-mouse2"
import { useZoom } from "./use-zoom"
import { useElementUnderMouse } from "./use-element-under-mouse"
import { GlobalDragContext } from "./App"

export function useMouseDrag<T extends HTMLElement>(
  onDrag: (delta: Pos) => void,
  onEnd: () => void,
  scale: number = 1,
) {
  const [dragging, setDragging] = useState(false)
  const { dragRef, setDragRef } = useContext(GlobalDragContext)
  const [initialMouseDownPosition, setInitialMouseDownPosition] = useState<Pos>()

  const mouse = useMouse(() => { })
  const {
    leftClick,
    positionDelta,
    position: mousePos,
  } = mouse

  const { elementIdUnderMouse } = useElementUnderMouse()

  useEffect(() => {
    if (leftClick
      && !dragging
      && !dragRef
      && !initialMouseDownPosition
    ) {
      setInitialMouseDownPosition(mousePos)
    }
    if (!leftClick) {
      setInitialMouseDownPosition(undefined)
    }

    if (
      mousePos && initialMouseDownPosition
      && mousePos.subtract(initialMouseDownPosition).manhatDist > 10
    ) {
      setDragging(true)
      if (elementIdUnderMouse && !dragRef) {
        setDragRef(elementIdUnderMouse)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftClick,
    positionDelta,
    dragging,
    mousePos,
    dragRef,
    setDragRef,
    initialMouseDownPosition,
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
    positionDelta: positionDelta.scale(1 / zoomFactor),
  }
}