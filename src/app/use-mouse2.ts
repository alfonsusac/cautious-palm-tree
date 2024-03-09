/* eslint-disable react-hooks/exhaustive-deps */
import { use, useEffect, useState } from "react"
import { Pos } from "./pos"
import toast from "react-hot-toast"

type CustomMouseEventPayload = {
  position: Pos,
  positionDelta: Pos,
  scrollDelta: number,
  leftClick: boolean,
  rightClick: boolean,
  middleClick: boolean,
  event: MouseEvent | WheelEvent
  prev: {
    position: Pos,
    scrollDelta: number,
    leftClick: boolean,
    rightClick: boolean,
    middleClick: boolean,
    event: MouseEvent | WheelEvent
  } | undefined
}

export function useMouse(mouseEv: (
  data: CustomMouseEventPayload) => void,
) {
  const [mouseBasicEvent, setMouseBasicEvent] = useState<{
    position: Pos,
    scrollDelta: number,
    leftClick: boolean,
    rightClick: boolean,
    middleClick: boolean,
    event: MouseEvent | WheelEvent
  }>()
  const [prevMouseBasicEvent, setPrevMouseBasicEvent] = useState<{
    position: Pos,
    scrollDelta: number,
    leftClick: boolean,
    rightClick: boolean,
    middleClick: boolean,
    event: MouseEvent | WheelEvent
  }>()
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
      // toast(delta + '')
      mouseEv({
        ...mouseBasicEvent,
        prev: prevMouseBasicEvent,
        positionDelta: delta,
      })
    }
  }, [mouseBasicEvent])

  return {
    ...mouseBasicEvent,
    prev: prevMouseBasicEvent,
    positionDelta
  }
}


export function useMouseEventListener(
  mouseEv: (data: {
    position: Pos,
    scrollDelta: number,
    leftClick: boolean,
    rightClick: boolean,
    middleClick: boolean,
    event: MouseEvent | WheelEvent,
  }) => void
) {
  useEffect(() => {
    function mouseEventHandler(e: MouseEvent) {
      // console.log(e.button, e.buttons)
      mouseEv({
        position: new Pos(e.clientX, e.clientY),
        scrollDelta: 0,
        leftClick: e.buttons === 1,
        rightClick: e.buttons === 2,
        middleClick: e.buttons === 4,
        event: e
      })
    }
    function wheelEventHandler(e: WheelEvent) {
      // console.log(e.button, e.buttons)
      mouseEv({
        position: new Pos(e.clientX, e.clientY),
        scrollDelta: e.deltaY,
        leftClick: e.buttons === 1,
        rightClick: e.buttons === 2,
        middleClick: e.buttons === 4,
        event: e
      })
    }
    window.addEventListener('mousemove', mouseEventHandler)
    window.addEventListener('mousedown', mouseEventHandler)
    window.addEventListener('mouseup', mouseEventHandler)
    window.addEventListener('wheel', wheelEventHandler)
    return () => {
      window.removeEventListener('mousemove', mouseEventHandler)
      window.removeEventListener('mousedown', mouseEventHandler)
      window.removeEventListener('mouseup', mouseEventHandler)
      window.removeEventListener('wheel', wheelEventHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}