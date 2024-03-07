/* eslint-disable react-hooks/exhaustive-deps */
import { use, useEffect, useState } from "react"
import { Pos } from "./pos"
import toast from "react-hot-toast"

type CustomMouseEventPayload = {
  position: Pos,
  positionDelta: Pos,
  scroll: number,
  leftClick: boolean,
  rightClick: boolean,
  middleClick: boolean,
}

export function useMouse(mouseEv: (
  data: CustomMouseEventPayload) => void,
) {
  const [mouseBasicEvent, setMouseBasicEvent] = useState<{
    position: Pos,
    scroll: number,
    leftClick: boolean,
    rightClick: boolean,
    middleClick: boolean,
  }>()
  const [prevPosition, setPrevPosition] = useState<null | Pos>(null)
  const [positionDelta, setPositionDelta] = useState(new Pos(0, 0))

  useMouseEventListener((event) => {
    setMouseBasicEvent(event)
  })

  useEffect(() => {
    if (mouseBasicEvent) {
      const delta = mouseBasicEvent.position.subtract(prevPosition ?? mouseBasicEvent.position)
      setPrevPosition(mouseBasicEvent.position)
      setPositionDelta(delta)
      // toast(delta + '')
      mouseEv({
        ...mouseBasicEvent,
        positionDelta: delta,
      })
    }
  }, [mouseBasicEvent])
  
  return {
    ...mouseBasicEvent,
    positionDelta
  }
}


export function useMouseEventListener(
  mouseEv: (data: {
    position: Pos,
    scroll: number,
    leftClick: boolean,
    rightClick: boolean,
    middleClick: boolean,
  }) => void
) {
  useEffect(() => {
    function mouseEventHandler(e: MouseEvent) {
      // console.log(e.button, e.buttons)
      mouseEv({
        position: new Pos(e.clientX, e.clientY),
        scroll: 0,
        leftClick: e.buttons === 1,
        rightClick: e.buttons === 2,
        middleClick: e.buttons === 4,
      })
    }
    function wheelEventHandler(e: WheelEvent) {
      // console.log(e.button, e.buttons)
      mouseEv({
        position: new Pos(e.clientX, e.clientY),
        scroll: e.deltaZ,
        leftClick: e.buttons === 1,
        rightClick: e.buttons === 2,
        middleClick: e.buttons === 4,
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