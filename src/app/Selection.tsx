import { useContext, useEffect, useRef, useState } from "react"
import { useMouseDrag } from "./use-mouse-drag"
import { Pos } from "./pos"
import { GlobalDragContext } from "./app"
import toast from "react-hot-toast"

export function SelectionBox() {

  const {
    dragRef
  } = useContext(GlobalDragContext)
  const isSelecting = dragRef === "Workspace"

  const boxRef = useRef<HTMLDivElement>(null)
  const {
    position
  } = useMouseDrag(
    boxRef,
    new Pos(0, 0),
    () => {

    },
    () => {

    }
  )

  const [initPos, setInitPos] = useState<Pos>()
  const [distance, setDistance] = useState<Pos>()

  useEffect(() => {
    if (isSelecting) {

      // toast(isSelecting + ' ' + initPos + " " + position)
      if (isSelecting && position && !initPos) {
        setInitPos(position) // once
        // console.log("Setting Up Init Pos")
        // toast("set up init pos")
      }
    }
  }, [isSelecting, initPos, position])

  useEffect(() => {
    if (isSelecting && position && initPos) {
      setDistance(position.subtract(initPos))
    }
  }, [isSelecting, position, initPos])

  useEffect(() => {
    if (!isSelecting) {
      setInitPos(undefined)
    }
  }, [isSelecting])

  // If no distance or no initial position or is not even selecting then return null
  if (!distance || !initPos || !isSelecting) return null

  const left = distance.x > 0 ? initPos.x : initPos.x + distance.x
  const top = distance.y > 0 ? initPos.y : initPos.y + distance.y
  const width = Math.abs(distance.x)
  const height = Math.abs(distance.y)

  return (
    <div
      className="fixed z-10 inset-0 w-full h-full border-[0.1rem] rounded-md border-blue-500 bg-blue-500/20"
      style={{
        width,
        height,
        transform: `translateX(${ left }px) translateY(${ top }px)`
      }}
    >
    </div>

  )
}