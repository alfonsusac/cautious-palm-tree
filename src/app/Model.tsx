import { useEffect, useRef, useState } from "react"
import { NodeData } from "./node"
import { useMouse, useMouseEventListener } from "./use-mouse2"
import { Pos } from "./pos"
import { useMouseDrag } from "./use-mouse-drag"

export function Model(
  props: {
    data: NodeData
    onDragEnd: (newPos: Pos) => void
  }
) {

  const [position, setPosition] = useState(props.data.position)
  const ref = useRef<HTMLDivElement>(null)
  const {
    dragging,
  } = useMouseDrag(
    ref,
    new Pos(0,0),
    (delta) => {
      setPosition(position.add(delta))
    },
    () => {
      props.onDragEnd(position)
    }
  )
  return <div
    id={props.data.id}
    ref={ref}
    className="w-40 h-40 bg-orange-300 select-none shadow-xl"
    style={{
      transform: `translateX(${ position.x }px) translateY(${ position.y }px)`
    }}
  >
    {position + ""}<br />
    {dragging + ""}<br />
  </div>
}