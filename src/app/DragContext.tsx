import { ReactNode, createContext, useContext, useState } from "react"
import { Pos } from "./pos"
import { Rect } from "./rect"
import { getElementIdUnderMouse } from "./use-mouse2"
import { useApp } from "./App"
import { Mouse } from "./use-mouse3"
import { ObservableValue } from "./EventListener"
import toast from "react-hot-toast"

export class Drag {
  context = new ObservableValue<{ id: string, initialPosition: Pos } | undefined>
  region = new ObservableValue<Rect | undefined>
  useInit() {
    // how to ensure that this runs once per component?
    Mouse.onMouseUpdate.do(mouse => {
      // Initialize selection
      if (mouse.leftDown && !mouse.positionDelta.isZero && !this.active) {
        this.startDragging(getElementIdUnderMouse(mouse) ?? "workspace", mouse.position)
      }
      if (this.context.value?.initialPosition && mouse.position && mouse.leftDown) {
        this.region.setValue(Rect.fromPos(this.context.value.initialPosition, mouse.position))
      }
      if (!mouse.leftDown) {
        this.endDragging()
        this.region.setValue(undefined)
      }
      // End drag on keyup
      if (mouse.leftRelease && this.region.value) {
        this.endDragging()
        this.region.setValue(undefined)
      }
    })
  }
  get active() {
    return !!this.context.value
  }
  startDragging(id: string, initialPosition: Pos) {
    this.context.value = { id, initialPosition }
  }
  endDragging() {
    this.context.value = undefined
  }

}

export function DragContext(props: {
  children: ReactNode,
}) {
  const { drag } = useApp()



  return (
    <>
      {props.children}
    </>
  )
}
