import { Pos } from "./pos"
import { Zoom } from "./handle-zoom"
import { MouseEventPayload } from "./use-mouse3"

export function handlePanning(
  mouse: MouseEventPayload,
  zoom: Zoom,
  focused: boolean,
) {
  // Panning via middle click
  if (mouse.middleDown) {
    document.body.style.cursor = 'grab'
  } else {
    document.body.style.cursor = 'auto'
  }
  if (focused && mouse.middleDown) {
    return mouse.positionDelta
  }

  // Panning via trackpad
  const { scrollDelta, scrollDeltaX } = mouse
  if (!mouse.event.metaKey && !mouse.event.ctrlKey) {
    // Todo: Implement max delta
    return new Pos(-scrollDeltaX, -scrollDelta)
  }


  return new Pos(0,0)
}

// export function usePan(props: {
//   onPan: (offset: Pos) => void
// }) {
//   const [dragging, setDragging] = useState(false)
//   const state = { dragging }
//   const tabFocus = useTabFocus()
//   // 
//   // useApp().mouse.onMouseUpdate.do(mouse => {
//   //   if (!state.dragging && mouse.middleClick && tabFocus.focused) {
//   //     setDragging(true)
//   //     document.body.style.cursor = 'grab'
//   //   }
//   //   if (state.dragging && !mouse.middleClick) {
//   //     setDragging(false)
//   //     document.body.style.cursor = 'auto'
//   //   }
//   //   if (state.dragging && mouse.middleClick) {
//   //     props.onPan(mouse.positionDelta)
//   //   }
//   // })


//   // useMouse((mouse) => {
//   //   if (!state.dragging && mouse.middleClick && tabFocus.focused) {
//   //     setDragging(true)
//   //     document.body.style.cursor = 'grab'
//   //   }
//   //   if (state.dragging && !mouse.middleClick) {
//   //     setDragging(false)
//   //     document.body.style.cursor = 'auto'
//   //   }
//   //   if (state.dragging && mouse.middleClick) {
//   //     props.onPan(mouse.positionDelta)
//   //   }
//   // })


//   // Listens to wheel events (for trackpads)
//   useEventListener('wheel', (e) => {
//     // We are only concerned for those devices that has 
//     // . deltaX, which are mainly trackpads.
//     // if (!e.deltaX) return

//     // Determine the delta (a.k.a movement)
//     const trackpadMovement = new Pos(-e.deltaX, -e.deltaY)
//     props.onPan(trackpadMovement)
//   })

//   return {
//     dragging
//   }
// }