/* eslint-disable react-hooks/exhaustive-deps */
import { use, useEffect, useState } from "react"
import { Pos } from "./pos"
import { useEventListener } from "./use-event-listener"

export function getElementIdUnderMouse(mouse:CustomMouseEventPayload) {
  const el = document.elementFromPoint(mouse.position.x, mouse.position.y)
  if (!el) return
  if (el.id === "") return
  return el.id
}

export type CustomMouseEventPayload = MouseEventListenerPayload & {
  positionDelta: Pos,
  prev: MouseEventListenerPayload | undefined
}

export function useMouse(mouseEv?: (
  data: CustomMouseEventPayload) => void,
) {
  const [mouseBasicEvent, setMouseBasicEvent] = useState<MouseEventListenerPayload>()
  const [prevMouseBasicEvent, setPrevMouseBasicEvent] = useState<MouseEventListenerPayload>()
  const [prevPosition, setPrevPosition] = useState<null | Pos>(null)
  const [positionDelta, setPositionDelta] = useState(new Pos(0, 0))

  useMouseEventListener((event) => {
    setMouseBasicEvent(prev => {
      setPrevMouseBasicEvent(prev)
      return event
    })
  })

  useEffect(() => {
    if (mouseBasicEvent) {
      const delta = mouseBasicEvent.position.subtract(prevPosition ?? mouseBasicEvent.position)
      setPrevPosition(mouseBasicEvent.position)
      setPositionDelta(delta)
      // console.log(mouseBasicEvent)
      mouseEv?.((() => {
        // console.log("Hellol", mouseBasicEvent.leftClick)
        return {
          ...mouseBasicEvent,
          prev: prevMouseBasicEvent,
          positionDelta: delta,
        }
      })())
    }
  }, [mouseBasicEvent])

  return {
    ...mouseBasicEvent,
    prev: prevMouseBasicEvent,
    positionDelta
  }
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

export function useMouseEventListener(
  mouseEv: (data: MouseEventListenerPayload) => void
) {
  function eventHandler(e: MouseEvent | WheelEvent) {
    // console.log("test")
    mouseEv({
      position: new Pos(e.clientX, e.clientY),
      scrollDelta: "deltaY" in e ? e.deltaY : 0,
      scrollDeltaX: "deltaX" in e ? e.deltaX : 0,
      leftClick: e.buttons === 1,
      rightClick: e.buttons === 2,
      middleClick: e.buttons === 4,
      event: e
    })
  }
  useEventListener("mousemove", eventHandler)
  useEventListener("mousedown", eventHandler)
  useEventListener("mouseup", eventHandler)
  useEventListener("mouseup", eventHandler)
  useEventListener("wheel", eventHandler)
}