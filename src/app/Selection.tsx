import { useContext, useEffect, useRef, useState } from "react"
import { useMouseDrag } from "./use-mouse-drag"
import { Pos } from "./pos"
import { GlobalDragContext, GlobalSelectionContext } from "./App"
import toast from "react-hot-toast"
import { createRect } from "./rect"

export function SelectionBox() {

  const { setRegion, region } = useContext(GlobalSelectionContext)
  const { dragRef } = useContext(GlobalDragContext)
  const isSelecting = dragRef === "Workspace"

  const boxRef = useRef<HTMLDivElement>(null)
  const { position, dragging, leftClick } = useMouseDrag(() => { }, () => { })

  const [initPos, setInitPos] = useState<Pos>()
  const [distance, setDistance] = useState<Pos>()

  useEffect(() => {
    if (isSelecting && position && !initPos) {
      setInitPos(position) // once
    }
    if (isSelecting && position && initPos) {
      setDistance(position.subtract(initPos))
    }
  }, [isSelecting, initPos, position])

  useEffect(() => {
    if (!isSelecting) {
      setInitPos(undefined)
    }
  }, [isSelecting])

  useEffect(() => {
    if (!distance || !initPos || !isSelecting) return

    const left = distance.x > 0 ? initPos.x : initPos.x + distance.x
    const top = distance.y > 0 ? initPos.y : initPos.y + distance.y
    const width = Math.abs(distance.x)
    const height = Math.abs(distance.y)

    if (dragging) {
      setRegion({
        top, left, bottom: top + height, right: left + width,
      })
    }
    if (!leftClick) {
      setRegion(null)
    }

  }, [distance, initPos, isSelecting, setRegion, dragging, leftClick])

  // If no distance or no initial position or is not even selecting then return null
  if (!distance || !initPos || !isSelecting || !dragging) return null

  const left = distance.x > 0 ? initPos.x : initPos.x + distance.x
  const top = distance.y > 0 ? initPos.y : initPos.y + distance.y
  const width = Math.abs(distance.x)
  const height = Math.abs(distance.y)



  return (
    <div
      className="fixed z-10 inset-0 w-full h-full border-[0.1rem] rounded-md border-blue-500 bg-blue-500/20 text-white select-none"
      style={{
        width,
        height,
        transform: `translateX(${ left }px) translateY(${ top }px)`
      }}
    >
      {/* {
        region?.p1.toString()
      }
      {
        region?.p2.toString()
      } */}
    </div>
  )
}