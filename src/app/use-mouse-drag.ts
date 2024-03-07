import { Ref, RefObject, useContext, useEffect, useState } from "react"
import { Pos } from "./pos"
import { useMouse } from "./use-mouse2"
import { GlobalDragContext } from "./app"
import toast from "react-hot-toast"

export function useMouseDrag<T extends HTMLElement>(
  target: RefObject<T>,
  initialPosition: Pos, // todo: remove this
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

  useEffect(() => {
    if (leftClick && !positionDelta.isZero && !dragging && mousePos && !dragRef) {
      const el = document.elementFromPoint(mousePos.x, mousePos.y)

      if (!el) return
      if (!target.current) return
      if (el.id === target.current.id) {
        setDragging(true)
        setDragRef(el.id)
      }
    }
  }, [leftClick, positionDelta, dragging, mousePos, target, dragRef, setDragRef])

  useEffect(() => {
    if (leftClick === false && dragging) {
      setDragging(false)
      setDragRef(null)
      onEnd()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftClick, dragging, dragRef, setDragRef])

  useEffect(() => {
    if (dragging && positionDelta) {
      onDrag(positionDelta)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, positionDelta])

  return {
    dragging,
    ...mouse,
  }
}