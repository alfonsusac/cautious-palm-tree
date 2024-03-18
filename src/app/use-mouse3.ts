import { useRef } from "react"
import { EventListener } from "./EventListener"
import { Pos } from "./pos"
import { useEventListener } from "./use-event-listener"
import { CustomMouseEventPayload, useMouseEventListener } from "./use-mouse2"
import toast from "react-hot-toast"

export function useMouse(
  cb: (mouse: CustomMouseEventPayload) => void,
  deps?: any[],
) {
  Mouse.onMouseUpdate.do(cb, deps)
}

type MouseEventListenerPayload = {
  position: Pos,
  scrollDelta: number,
  scrollDeltaX: number
  leftClick: boolean,
  rightClick: boolean,
  middleClick: boolean,
  event: MouseEvent | WheelEvent,
}

export type MouseEventPayload = MouseEventListenerPayload & {
  positionDelta: Pos,
  leftClick: boolean,
  rightClick: boolean,
  middleClick: boolean,
  leftDown: boolean,
  rightDown: boolean,
  middleDown: boolean,
  leftRelease: boolean,
  rightRelease: boolean,
  middleRelease: boolean,
  prev?: MouseEventListenerPayload,
  getElementsUnder: () => Element[]
}

export const Mouse = {
  state: undefined as MouseEventPayload | undefined,
  previousData: undefined as MouseEventListenerPayload | undefined,
  onMouseUpdate: new EventListener<MouseEventPayload>,
  useHooks() {
    const mouse = this
    function eventHandler(e: MouseEvent | WheelEvent) {
      const position = new Pos(e.clientX, e.clientY)
      const payload = {
        position,
        scrollDelta: "deltaY" in e ? e.deltaY : 0,
        scrollDeltaX: "deltaX" in e ? e.deltaX : 0,
        leftClick: e.buttons === 1 && mouse.previousData?.event.buttons === 0,
        rightClick: e.buttons === 2 && mouse.previousData?.event.buttons === 0,
        middleClick: e.buttons === 4 && mouse.previousData?.event.buttons === 0,
        leftDown: e.buttons === 1,
        rightDown: e.buttons === 2,
        middleDown: e.buttons === 4,
        leftRelease: mouse.previousData?.event.buttons === 1 && e.buttons !== 1,
        rightRelease: mouse.previousData?.event.buttons === 2 && e.buttons !== 2,
        middleRelease: mouse.previousData?.event.buttons === 4 && e.buttons !== 4,
        event: e,
        positionDelta: position.subtract(mouse.previousData?.position ?? new Pos(0, 0)),
        prev: mouse.previousData,
        getElementsUnder() {
          return document.elementsFromPoint(e.clientX, e.clientY)
        }
      }
      mouse.state = payload;
      mouse.onMouseUpdate.emit(payload)
      mouse.previousData = payload
    }
    useEventListener("mousemove", eventHandler)
    useEventListener("mousedown", eventHandler)
    useEventListener("mouseup", eventHandler)
    useEventListener("mouseup", eventHandler)
    useEventListener("wheel", eventHandler)
  }
}