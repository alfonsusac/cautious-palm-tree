import { useEffect, useRef, useState } from "react"
import { Pos } from "./pos"
// import { useMouseDrag } from "./use-mouse-drag"
import { cn } from "@/lib/utils"
// import { useZoom } from "./use-zoom"
// import { useDragContext } from "./DragContext"
import { Model } from "./ModelDataContext"
import { useApp } from "./App"
import { useRerender } from "./use-rerender"

export function ModelComponent(
  props: {
    data: Model,
    onDragEnd: (newPos: Pos) => void,
  }
) {
  const model = props.data
  const { viewport } = useApp()
  const render = useRerender()
  model.onUpdate.do(render)
  const ref = useRef<HTMLDivElement>(null)
  // model.domref = ref.current

  // const [isInsideSelection, setIsInsideSelection] = useState(false)

  // useEffect(() => {
  //   if (!region) {
  //     setIsInsideSelection(false)
  //     selected ? addSelection([props.data.id]) : null
  //   }
  //   if (!ref.current || !region) return
  //   const box = Rect.fromDOMRect(ref.current.getBoundingClientRect())

  //   if (box.isIntersecting(region) || box.isInsideOf(region)) {
  //     setIsInsideSelection(true)
  //   } else {
  //     setIsInsideSelection(false)
  //   }
  // }, [region])

  // const isSelectedFromParent = selection.includes(props.data.id)
  // const [selected, setSelected] = useState(false)

  // useEffect(() => {
  //   setSelected((selection.includes(props.data.id) || isInsideSelection))
  // }, [isInsideSelection])

  // useEffect(() => {
  //   setSelected(selection.includes(props.data.id))
  // }, [isSelectedFromParent, selection, props.data.id])


  // const model = {
  //   selected,
  //   position,
  //   isThisElementDirectlyUnderMouse,
  // }



  // useEffect(() => {

  // // If selecting multiple, but no shift is clicked and detected a keyUp left click.
  // if (!leftClick && !draggingId.value && selection.length > 1 && isThisElementDirectlyUnderMouse && prev?.leftClick) {
  //   setSelection([props.data.id])
  // }

  // // All code below will trigger if leftClicked.
  // if (!leftClick || !mouseEv) return

  // if (!mouseEv.shiftKey) {
  //   // Select this element if this element directly is under the mouse.
  //   if (isThisElementDirectlyUnderMouse && isDragging.value === undefined && selection.length <= 1) {
  //     setSelection([props.data.id])
  //     // setSelected({ data: true })
  //   }
  //   // Unselect this element if the cursor is at the workspace
  //   if (elementIdUnderMouse === null && !draggingId.value) {
  //     clearSelection()
  //   }
  //   if (!isThisElementDirectlyUnderMouse) {

  //   }
  // } else {
  //   if (isThisElementDirectlyUnderMouse && !isDragging.value) {
  //     toggleSelection([props.data.id])
  //   }
  // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isThisElementDirectlyUnderMouse, leftClick, elementIdUnderMouse])

  // for thicker outline when zoomed out
  // const { inverseScale } = useZoom()



  return <div
    id={props.data.id}
    ref={(dom) => {
      model.domref = dom
      return ref
    }}
    className={cn(
      "min-w-40 absolute h-40 text-nowrap select-none  text-sm",
      'outline-blue-500 outline-offset-2 outline outline-0',
      'text-white bg-neutral-700 p-1 rounded-lg',
      'shadow-md shadow-black/60',
      '*:leading-none',
    )}
    style={{
      outlineWidth: `${ model.selected ? viewport.zoom.inversedScale * 2 : 0 }px`,
      transform: `translateX(${ model.position.x }px) translateY(${ model.position.y }px)`
    }}
    data-context={`model__${ model.id }`}
    data-model={model.id}
  >
    <div className="">
      {model.position + ""}<br />
    </div>
    {/* Dragging: {isDragging + ""}<br />
    Selection: {selection.includes(props.data.id) + ""}<br />
    InsideSeleciton: {isInsideSelection + ""}<br />
    Selected: {model.selected + ""}<br /> */}
    {/* Shift: {mouseEv?.shiftKey + ""}<br /> */}
    {/* PointerUndr: {isThisElementDirectlyUnderMouse + ""}<br /> */}
  </div>
}