import { ReactNode, useEffect, useRef, useState } from "react"
import { Pos } from "./pos"
import { useMouse, useMouseEventListener } from "./use-mouse2"
import toast from "react-hot-toast"
import useTabFocus from "./use-active-tab"
import { useMouseDrag } from "./use-mouse-drag"



export function Workspace(
  props: {
    children?: ReactNode
  }
) {

  const [viewOffset, setViewOffset] = useState(new Pos(0, 0))
  const [dragging, setDragging] = useState(false)
  const { isTabFocused } = useTabFocus()
  const { middleClick, positionDelta } = useMouse((data) => {

  })

  useEffect(() => {
    if (!dragging && middleClick && isTabFocused) {
      setDragging(true)
      // toast("DragStart")

    }
    if (dragging && !middleClick) {
      // toast("DragEnd")
      setDragging(false)
    }
    if (dragging && middleClick) {
      setViewOffset(prev => prev.add(positionDelta))
    }
  }, [middleClick, dragging, positionDelta, isTabFocused])

  // useMouse(({ }) => {

  // })
  // useMouse(({ }) => {

  // })
  // useMouse(({ }) => {

  // })

  const workspaceRef = useRef<HTMLDivElement>(null)
  const { } = useMouseDrag(
    workspaceRef,
    new Pos(0, 0),
    () => { },
    () => { },
  )

  return (
    <div
      id="Workspace"
      ref={workspaceRef}
      className="bg-neutral-900/50 w-screen h-screen relative border border-white"
      style={{
        transform: `perspective(1px) translateZ(${ 0 }px) translateX(${ viewOffset.x }px) translateY(${ viewOffset.y }px)`,
      }}
    >
      {props.children}
    </div>
  )
}