import { X } from "lucide-react"
import { MutableRefObject, ReactNode, RefObject, createContext, useContext, useEffect, useRef } from "react"
import { useEventListener } from "./use-event-listener"
import { EventListener } from "./EventListener"

type MouseData = {
  leftClick: boolean,
  rightClick: boolean,
}
class InputHandler {
  onMouseMove = new EventListener<MouseData>
}
const InputContext = createContext<RefObject<InputHandler>>({} as any)
export const useInput = () => useContext(InputContext).current

export function InputProvider(props: {
  children: ReactNode
}) {
  const ref = useRef(new InputHandler)
  const input = ref.current
  // useEventListener('mousemove',)
  return (
    <InputContext.Provider value={ref}>
      {props.children}
    </InputContext.Provider>
  )
}