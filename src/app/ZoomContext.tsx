import { MutableRefObject, ReactNode, RefObject, createContext, useContext, useRef } from "react"
import { Zoom } from "./handle-zoom"

const ZoomRefContext = createContext<{
  zoomRef: MutableRefObject<Zoom>
}>({} as any)

export const useZoom = () => {
  const ref = useContext(ZoomRefContext)
  if (!ref?.zoomRef?.current) throw new Error("useZoom must be used under ZoomRefContext")
  return ref.zoomRef.current
}
export const useZoomRef = () => {
  return useContext(ZoomRefContext).zoomRef
}


export function ZoomContext(
  props: {
    children?: ReactNode
  }
) {
  const zoomRef = useRef(new Zoom)
  return (
    <ZoomRefContext.Provider value={{ zoomRef }}>
      {props.children}
    </ZoomRefContext.Provider>
  )
}