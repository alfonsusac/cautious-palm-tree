import { ReactNode, createContext, useContext, useState } from "react"
import { Pos } from "./pos"
import { Rect } from "./rect"
import toast from "react-hot-toast"
import { getElementIdUnderMouse, useMouse } from "./use-mouse2"

export type DragContextValue = {
  id: string | "workspace",
  initPosition: Pos,
}

const AppDraggingContext = createContext<
  {
    value: DragContextValue | undefined,
    set: (val: DragContextValue | undefined) => void,
  }
>({} as any)

const AppDraggingRegionContext = createContext<Rect | undefined>(undefined)
export const useDragRegion = () => useContext(AppDraggingRegionContext)
const AppLastDragginRegionContext = createContext<Rect | undefined>(undefined)
export const useOnDrag = () => {

}


export const useDraggingID = () => useContext(AppDraggingContext)

export function DragContext(props: { children: ReactNode }) {
  const [value, set] = useState<DragContextValue>()
  const startDragging = (id: string, initPosition: Pos) => set({ id, initPosition })
  const endDragging = () => set(undefined)
  const [region, setRegion] = useState<Rect>()
  const [lastFinalRegion, setLastFinalRegion] = useState<Rect>()
  const state = {
    value,
    region,
    dragging: value
  }
  useMouse(mouse => {
    // Initialize selection
    if (mouse.leftClick && !mouse.positionDelta.isZero && !state.dragging) {
      startDragging(getElementIdUnderMouse(mouse) ?? "workspace", mouse.position)
    } 
    if (state.value?.initPosition && mouse.position) {
      setRegion(Rect.fromPos(state.value.initPosition, mouse.position))
    }
    // End drag on keyup
    if (mouse.prev?.leftClick && !mouse.leftClick && state.region) {
      endDragging()
      setLastFinalRegion(state.region)
      setRegion(undefined)
    }
  })

  return (
    <AppDraggingContext.Provider value={{ value, set }}>
      <AppDraggingRegionContext.Provider value={region}>
        <AppLastDragginRegionContext.Provider value={lastFinalRegion}>
          {props.children}
        </AppLastDragginRegionContext.Provider>
      </AppDraggingRegionContext.Provider>
    </AppDraggingContext.Provider>
  )
}

export function useDragContext() {
  const { set: setContext, value: context } = useDraggingID()
  // const { setValue: setIsDragging, value: isDragging } = useIsDragging()
  return {
    context,
    setContext,
    isDragging: !!context,
  }
}