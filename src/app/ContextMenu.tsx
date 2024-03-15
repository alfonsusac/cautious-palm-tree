import { Dropdown } from "@/components/dropdown"
import { MouseEvent, useEffect, useState } from "react"
import { Pos } from "./pos"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import { useEventListener } from "./use-event-listener"
// import { useData } from "./ModelDataContext"
import { useApp } from "./App"
// import { useView } from "./ViewContext"

export function AppContextMenu() {

  // const view = useView()
  const { viewport, models } = useApp()
  const [position, setPosition] = useState(new Pos(0, 0))
  const [open, setOpen] = useState(false)

  useEventListener('contextmenu', (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    console.log("ContextMenu on id:", el?.id)
    if (el?.id === "background") {
      e.preventDefault()
      setPosition(new Pos(e.clientX, e.clientY))
      setOpen(true)
    }
  })

  function createNewModelClicked(e: MouseEvent<HTMLDivElement>) {
    const screenHalf = new Pos(window.innerWidth / 2, window.innerHeight / 2)

    models.createModel(
      new Pos(e.clientX, e.clientY)
        .subtract(screenHalf)
        .scale(viewport.zoom.inversedScale)
        .subtract(viewport.position)
    )
  }


  return (
    <Dropdown
      className="origin-center fixed w-48"
      style={{
        transform: `translate(${ position.x }px, ${ position.y }px)`
      }}
      open={!!open}
      onOpenChange={(e) => {
        setOpen(e)
      }}
    >
      {
        ({ Item }) => {


          return (<>
            <Item
              className="gap-1 cursor-pointer"
              onClick={(e) => {
                toast("Hello World")
                createNewModelClicked(e)
              }}
            ><Plus size={16} /> Create New Model</Item>
          </>)
        }
      }
    </Dropdown>
  )
}