import { useContext, useEffect, useRef, useState } from "react"
import { NodeData } from "./node"
import { Pos } from "./pos"
import { useMouseDrag } from "./use-mouse-drag"
import { useElementUnderMouse } from "./use-element-under-mouse"
import { cn } from "@/lib/utils"
import { useZoom } from "./use-zoom"
import { GlobalDragContext, GlobalSelectionContext } from "./App"
import toast from "react-hot-toast"
import { isInside, isIntersecting } from "./rect"

export function Model(
  props: {
    data: Readonly<NodeData>,
    onDragEnd: (newPos: Pos) => void
  }
) {
  const [position, setPosition] = useState(props.data.position)
  const {
    region,
    selection,
    setSelection,
    addSelection,
    clearSelection,
    toggleSelection,
  } = useContext(GlobalSelectionContext)

  const dragCtx = useContext(GlobalDragContext)
  const { elementIdUnderMouse } = useElementUnderMouse()
  const isThisElementDirectlyUnderMouse = elementIdUnderMouse === props.data.id
  const ref = useRef<HTMLDivElement>(null)
  const {
    dragging,
    leftClick,
    event: mouseEv,
    prev,
  } = useMouseDrag(
    (delta) => {
      if (model.selected && dragCtx.dragRef !== "Workspace") {
        setPosition(position.add(delta))
      }
    },
    () => { props.onDragEnd(position) }
  )

  const [isInsideSelection, setIsInsideSelection] = useState(false)

  useEffect(() => {
    if (!region) {
      setIsInsideSelection(false)
      selected ? addSelection([props.data.id]) : null
    }

    if (!ref.current || !region) return

    const box = ref.current.getBoundingClientRect()
    if (isIntersecting(box, region) || isInside(box, region)) {
      setIsInsideSelection(true)
    } else {
      setIsInsideSelection(false)
    }
  }, [region])

  const isSelectedFromParent = selection.includes(props.data.id)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    setSelected((selection.includes(props.data.id) || isInsideSelection))
  }, [isInsideSelection])

  useEffect(() => {
    setSelected(selection.includes(props.data.id))
  }, [isSelectedFromParent, selection, props.data.id])


  const model = {
    selected,
    position,
    isThisElementDirectlyUnderMouse,
  }

  useEffect(() => {

    if (!leftClick && !dragCtx.dragRef && selection.length > 1 && isThisElementDirectlyUnderMouse && prev?.leftClick) {
      // toast("This?")
      setSelection([props.data.id])
    }

    // All code below will trigger if leftClicked.
    if (!leftClick || !mouseEv) return

    if (!mouseEv.shiftKey) {
      // Select this element if this element directly is under the mouse.
      if (isThisElementDirectlyUnderMouse && !dragCtx.dragRef && selection.length === 1) {
        setSelection([props.data.id])
        // setSelected({ data: true })
      }
      // Unselect this element if the cursor is at the workspace
      if (elementIdUnderMouse === "Workspace" && !dragCtx.dragRef) {
        clearSelection()
      }
      if (!isThisElementDirectlyUnderMouse) {

      }
    } else {
      if (isThisElementDirectlyUnderMouse && !dragCtx.dragRef) {
        toggleSelection([props.data.id])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isThisElementDirectlyUnderMouse, leftClick, elementIdUnderMouse])

  // for thicker outline when zoomed out
  const { inverseZoom } = useZoom()



  return <div
    id={props.data.id}
    ref={ref}
    className={cn(
      "w-40 h-40 text-nowrap text-red-500 bg-orange-300 select-none shadow-xl text-sm",
      'outline-blue-500 outline-offset-2 outline outline-0',
    )}
    style={{
      outlineWidth: `${ model.selected ? inverseZoom * 2 : 0 }px`,
      transform: `translateX(${ position.x }px) translateY(${ position.y }px)`
    }}
  >
    {position + ""}<br />
    Dragging: {dragging + ""}<br />
    Selection: {selection.includes(props.data.id) + ""}<br />
    InsideSeleciton: {isInsideSelection + ""}<br />
    Selected: {model.selected + ""}<br />
    Shift: {mouseEv?.shiftKey + ""}<br />
    PointerUndr: {isThisElementDirectlyUnderMouse + ""}<br />
  </div>
}