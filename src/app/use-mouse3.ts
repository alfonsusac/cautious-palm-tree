import { useApp } from "./AppComponent"
import { EventListener } from "./EventListener"
import { Pos } from "./pos"
import { useEventListener } from "./use-event-listener"
import { CustomMouseEventPayload } from "./use-mouse2"

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

export const Mouse = {
  previousData: undefined as MouseEventListenerPayload | undefined,
  onMouseUpdate: new EventListener<
    MouseEventListenerPayload & {
      positionDelta: Pos,
      prev?: MouseEventListenerPayload
    }
  >,
  useHooks() {
    const mouse = this
    function eventHandler(e: MouseEvent | WheelEvent) {
      const position = new Pos(e.clientX, e.clientY)
      const payload = {
        position,
        scrollDelta: "deltaY" in e ? e.deltaY : 0,
        scrollDeltaX: "deltaX" in e ? e.deltaX : 0,
        leftClick: e.buttons === 1,
        rightClick: e.buttons === 2,
        middleClick: e.buttons === 4,
        event: e,
        positionDelta: position.subtract(mouse.previousData?.position ?? new Pos(0, 0)),
        prev: mouse.previousData
      }
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