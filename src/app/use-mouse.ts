import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Pos } from "./pos"

export function useMouse() {
  const [mousePosition, setMousePosition] = useState(new Pos(0, 0))
  const [deltaMousePos, setDeltaMousePos] = useState(new Pos(0, 0))
  const [leftClick, setLeftClick] = useState(false)
  const [rightClick, setRightClick] = useState(false)
  const [middleClick, setMiddleClick] = useState(false)
  const [isMiddleDragging, setIsMiddleDragging] = useState(false)
  const [isLeftDragging, setIsLeftDragging] = useState(false)
  const [initialDragPosition, setInitialDragPosition] = useState<null | Pos>(null)
  const [dragDistance, setDragDistance] = useState<null | Pos>(null)

  // useEffect(() => {
  //   toast("LeftClick: " + leftClick)
  // }, [leftClick])
  // useEffect(() => {
  // toast(deltaMousePos.toString())
  // }, [deltaMousePos])

  useEffect(() => {
    if (initialDragPosition) {
      // toast(isDragging ? "Dragging" : "Not" + " Init Position:" + initialDragPosition.toString())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiddleDragging, initialDragPosition])

  useEffect(() => {
    if (middleClick) {
      setIsMiddleDragging(prev => {
        if (prev === false) {
          setInitialDragPosition(mousePosition)

          // THis is added so that when user unfocus the window and tries to pan, it doesnt jump due to
          //  having the previous pointer be somwhere else
          // .  This is because mouse dont get detected properly if window is not focused
          // .  Specifically if the mouse isnt interacting with the window (if its not being middleclick dragged while window is not focused.)
          setDeltaMousePos(new Pos(0, 0))
        }
        return true
      })
    }
    if (isMiddleDragging) {
      // toast(`${ mousePosition.subtract(initialDragPosition!) }`)
      setDragDistance(mousePosition.subtract(initialDragPosition!))
    }


    if (leftClick) {
      setIsLeftDragging(prev => {

        // Only enable drag IFF the mouse has been moved from initial click position.
        if (!deltaMousePos.zero()) {
          if (prev === false) {
            setInitialDragPosition(mousePosition)
  
            // THis is added so that when user unfocus the window and tries to pan, it doesnt jump due to
            //  having the previous pointer be somwhere else
            // .  This is because mouse dont get detected properly if window is not focused
            // .  Specifically if the mouse isnt interacting with the window (if its not being middleclick dragged while window is not focused.)
            setDeltaMousePos(new Pos(0, 0))
          }
          return true
        }
        return prev
      })
    }
    if (isLeftDragging) {
      // toast(`${ mousePosition.subtract(initialDragPosition!) }`)
      setDragDistance(mousePosition.subtract(initialDragPosition!))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mousePosition])

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition(prev => {
        // toast(prev.toString())
        const newDelta = new Pos(ev.clientX - prev.x, ev.clientY - prev.y)
        setDeltaMousePos(newDelta)
        return new Pos(ev.clientX, ev.clientY)
      })
    }
    window.addEventListener('mousemove', updateMousePosition)

    const updateMouseDown = (ev: MouseEvent) => {
      // toast(`${ ev.button } ${ ev.buttons }`)
      updateMousePosition(ev)
      if (ev.button === 0) setLeftClick(true)
      if (ev.button === 2) setRightClick(true)
      if (ev.button === 1) setMiddleClick(true)

    }
    window.addEventListener('mousedown', updateMouseDown)
    const updateMouseUp = (ev: MouseEvent) => {
      // toast(`${ ev.button } ${ ev.buttons }`)
      updateMousePosition(ev)
      if (ev.button === 0) setLeftClick(false)
      if (ev.button === 2) setRightClick(false)
      if (ev.button === 1) setMiddleClick(false)
      setIsMiddleDragging(false)
      setIsLeftDragging(false)
    }
    window.addEventListener('mouseup', updateMouseUp)
    window.addEventListener('wheel', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousedown', updateMouseDown)
      window.removeEventListener('mouseup', updateMouseUp)
      window.removeEventListener('wheel', updateMousePosition)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    mousePosition,
    leftClick,
    rightClick,
    middleClick,
    isMiddleDragging,
    isLeftDragging,
    initialDragPosition,
    dragDistance,
    deltaMousePos
  }
}

export function useZoom() {
  const minZoom = 0.5 // 200%
  const maxZoom = -4 // 20%
  const [zoom, setZoom] = useState(0)
  const [zoomDelta, setZoomDelta] = useState(0)
  const { mousePosition } = useMouse()
  const [zoomMousePositionOffset, setZoomMousePositionOffset] = useState(new Pos(0, 0))

  useEffect(() => {
    function updateWheel(e: WheelEvent) {
      setZoom(prev => {

        const scrollStep = 1 // Fixed scroll step size
        const zoomOutFactor = 0.02 // Percentage decrease per scroll step when zooming out
        const zoomInFactor = 0.02 // Percentage increase per scroll step when zooming in

        // Determine the scaling factor based on the direction of the zoom
        const scaleFactor = e.deltaY < 0 ? (1 + zoomInFactor * scrollStep) : (1 - zoomOutFactor * scrollStep)
        let newZoom = prev - e.deltaY / 1200

        if (newZoom > minZoom) {
          newZoom = minZoom
          // toast("A")
        }
        else if (newZoom < maxZoom) {
          // toast("B")
          newZoom = maxZoom
        }

        // const res = prev - e.deltaY/100
        // toast("DeltaZOom: " + (res - prev))
        const newZoomDelta = newZoom - prev
        setZoomDelta(newZoomDelta)

        // Mouse position zoom origin Offset calculation
        const screenCenter = new Pos(
          window.innerWidth / 2,
          window.innerHeight / 2
        )
        const distFromCenter = new Pos(e.clientX, e.clientY).subtract(screenCenter)
        setZoomMousePositionOffset(
          new Pos(
            distFromCenter.x * newZoomDelta,
            distFromCenter.y * newZoomDelta
          )
        )
        // toast(distFromCenter.toString())

        return newZoom
      })
      // setZoomDelta(-delta)
      if (e.deltaY < 0) {
      } else {
      }
    }
    window.addEventListener('wheel', updateWheel)
    return () => {
      window.removeEventListener('wheel', updateWheel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    zoom,
    zoomDelta,
    zoomRatio: 1 / (1 - zoom),
    zoomInvertedScale: 1 - zoom,
    zoomMousePositionOffset
  }
}