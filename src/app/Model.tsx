import { useEffect, useRef, useState } from "react"
import { NodeData } from "./node"
import { Pos } from "./pos"
import { useMouseDrag } from "./use-mouse-drag"
import { useElementUnderMouse } from "./use-element-under-mouse"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { useZoom } from "./use-zoom"
import { useKeyPress } from "./use-key-press"

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
    leftClick,
  } = useMouseDrag(
    ref,
    (delta) => { setPosition(position.add(delta)) },
    () => { props.onDragEnd(position) }
  )

  const [selected, setSelected] = useState(false)
  const { elementIdUnderMouse } = useElementUnderMouse()
  const isThisElementDirectlyUnderMouse = elementIdUnderMouse === props.data.id
  const shift = useKeyPress('Shift')


  useEffect(() => {
    if (
      isThisElementDirectlyUnderMouse && leftClick
    ) {
      setSelected(true)
    }
    if (leftClick && elementIdUnderMouse === "Workspace") {
      setSelected(false)
    }
    if (leftClick && !isThisElementDirectlyUnderMouse && !shift) {
      setSelected(false)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThisElementDirectlyUnderMouse, leftClick, elementIdUnderMouse])



  const { inverseZoom } = useZoom()

  return <div
    id={props.data.id}
    ref={ref}
    className={cn(
      "w-40 h-40 bg-orange-300 select-none shadow-xl",
      'outline-blue-500 outline-offset-2 outline outline-0',
      // selected ? "outline-" : ''
    )}
    style={{
      outlineWidth: `${ selected ? inverseZoom * 2 : 0 }px`,
      transform: `translateX(${ position.x }px) translateY(${ position.y }px)`
    }}
  >
    {position + ""}<br />
    {dragging + ""}<br />
    {selected + ""}<br />
  </div>
}