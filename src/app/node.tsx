import { Plus } from "lucide-react"
import { ForwardedRef, MouseEvent, RefObject, forwardRef, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useMouse, useZoom } from "./use-mouse"
import { motion } from "framer-motion"
import { Pos } from "./pos"
import Draggable from "react-draggable"


export type NodeData = {
  id: string
  position: Pos,
  title: string,
}


export const NodeComponent = forwardRef(
  function NodeComponent(
    props: {
      data: NodeData,
      selected: boolean
      onClick: (
        e: MouseEvent<HTMLDivElement>,
        node: NodeData,
        // ref: RefObject<HTMLDivElement>,
      ) => void,
      // onDrag: (
      //   delta: Pos
      // ) => void,
      // onMount: (
      //   ref: RefObject<HTMLDivElement>,
      // ) => void,
      isDragging: boolean
    },
    ref: ForwardedRef<HTMLDivElement>
  ) {
    // const [selected, setSelected] = useState(false)
    const selected = props.selected
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const { zoomInvertedScale } = useZoom()

    // useEffect(() => {
    //   props.onMount(nodeRef)
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])
    // const { deltaMousePos } = useMouse()

    // const [isDragging, setIsDragging] = useState(false)

    const { deltaMousePos, isLeftDragging } = useMouse()
    // const [dragOffset, setDragOffset] = useState<Pos>(new Pos(0, 0))

    useEffect(() => {
      if (isLeftDragging && props.isDragging) {
        // toast("THis left dragging")
        // setDragOffset(prev => prev.add(deltaMousePos))
        if (nodeRef.current) {
          // nodeRef.current.style.background = "red"
          nodeRef.current.style.transform = `translateX(${ props.data.position.x + deltaMousePos.x }px) translateY(${ props.data.position.y + deltaMousePos.y }px) translateZ(1px) perspective(1px)`
        }
      } else {
        if (nodeRef.current) {
          // nodeRef.current.style.background = "red"
        }
      }
    }, [deltaMousePos, isLeftDragging, props.isDragging])

    return (
      <div
        data-nodeid={props.data.id}
        className={cn("p-4 px-6 min-w-60 bg-neutral-600 rounded-md absolute text-white flex flex-col gap-2 transition-all duration-75 outline-blue-500  00 outline-offset-4",
          // selected && "outline outline-2"
        )}
        ref={(node) => {
          nodeRef.current = node
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
        }}
        // animate={{
        //   x: props.data.position.x,
        //   y: props.data.position.y
        // }}
        style={{
          // top: props.data.position.y,
          // left: props.data.position.x,
          outline: selected ? `${ zoomInvertedScale * 3 }px solid #3b82f6` : "",
          transform: `translateX(${ props.data.position.x }px) translateY(${ props.data.position.y }px) translateZ(1px) perspective(1px)`
        }}
        onClick={(e) => {
          e.stopPropagation()
          props.onClick?.(e, props.data)
        }}
        data-selected={selected}
      >
        {props.data.title}
        <button className="flex gap-2 px-4 py-2 -mx-5 -mb-3 items-center hover:bg-white/5 text-neutral-400">
          <Plus size={16} /> add field
        </button>
        <div className="absolute top-0 left-0 text-white">
          {props.isDragging ? "dragging" : "false"}
        </div>
      </div>
    )
  }
)

// export 

// export function NodeSelection(
//   props: {
//     nodeRef: RefObject<HTMLDivElement>
//   }
// ) {
//   // const { zoomMousePositionOffset } = useZoom()

//   if (!props.nodeRef.current) {
//     toast("Node Ref not found (selection map)")
//     // return
//   }
//   const { x, y, width, height } = props.nodeRef.current?.getBoundingClientRect() ?? {}
//   const offset = 8

//   useEffect(() => {

//   }, [])

//   if (!x || !y || !width || !height) return


//   return (
//     <div
//       className="fixed border-4 border-transparent"
//       style={{
//         top: `${ y - offset }px`,
//         left: `${ x - offset }px`,
//         width: `${ width + offset * 2 }px`,
//         height: `${ height + offset * 2 }px`,
//       }}
//     >

//     </div>
//   )
// }