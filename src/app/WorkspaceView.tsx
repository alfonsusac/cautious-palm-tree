import { ReactNode } from "react"
import { translateX, translateY, translateZ } from "./translate"
// import { useView } from "./ViewContext"
import { useRerender } from "./use-rerender"
import { useApp } from "./App"

export function WorkspaceView(
  props: {
    children?: ReactNode
  }
) {
  const render = useRerender()
  const { viewport } = useApp()
  viewport.onChange.do(render)

  return (
    <div className="w-0 h-0 relative left-1/2 top-1/2"
      style={{
        transform: `perspective(1px) ` + translateZ(viewport.zoom.scale) + translateX(viewport.position.x) + translateY(viewport.position.y),
      }}
    >
      <div className="pointer-events-none w-screen h-screen -translate-x-1/2 -translate-y-1/2 absolute border border-dashed  border-neutral-700" />
      {props.children}
    </div>
  )
}