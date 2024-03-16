import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { useApp } from "./App"
import { useRerender } from "./use-rerender"

export default function UILayer() {
  return (
    <div className="fixed text-white z-30">
      <TopBar />

      <BottomBar />
    </div>
  )
}

function TopBar() {
  return (
    <div className={cn(
      "fixed top-0 h-12 w-screen bg-zinc-800"
      , "flex items-center justify-between"
      , "px-2"
      , "shadow-md"
    )}>
      <div>
        <Button icon ghost>
          <Menu size={16} />
        </Button>
      </div>
      <div>Untitled</div>
      <div>
        <Button primary>Share</Button>
      </div>
    </div>
  )
}

function BottomBar() {
  return (
    <div className={cn(
      "fixed bottom-0 w-screen"
      , "flex items-end justify-between"
      , "shadow-md"
    )}>
      {/* Zoom */}
      <div className="bg-zinc-800 shadow-md p-3 px-5 rounded-tr-lg text-xs text-neutral-300">
        <ZoomIndicator />
      </div>

      {/* Help */}
      <Button className="bg-zinc-800 shadow-md m-2 w-10 h-10 rounded-full text-base" icon>
        ?
      </Button>
    </div>
  )
}

function ZoomIndicator() {
  const render = useRerender()
  const { viewport } = useApp()
  viewport.onChange.do(render)

  return Math.round(viewport.zoom.factor * 100) + '%'

}