import { Dropdown } from "@/components/dropdown"
import { MouseEvent, useEffect, useState } from "react"
import { Pos } from "./pos"
import { Plus, Trash, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { useEventListener } from "./use-event-listener"
// import { useData } from "./ModelDataContext"
import { useApp } from "./App"
// import { useView } from "./ViewContext"

export function AppContextMenu() {

  // const view = useView()
  const { viewport, models } = useApp()
  const [menu, setMenu] = useState<{
    position: Pos,
    target: string
  }>()

  useEventListener('contextmenu', (e) => {
    // const el = document.elementFromPoint(e.clientX, e.clientY)
    const els = document.elementsFromPoint(e.clientX, e.clientY)
    const el = els.find(e => e.getAttribute('data-context'))
    const contextid = el?.getAttribute('data-context')
    if (contextid) {
      e.preventDefault()
      setMenu({
        position: new Pos(e.clientX, e.clientY),
        target: contextid,
      })
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

  function deleteModelClicked(e: MouseEvent<HTMLDivElement>, id: string) {
    console.log(id)
    models.deleteModel(id)
  }


  return (
    <Dropdown
      className="origin-center fixed w-48 rounded-tl-none"
      style={{
        transform: `translate(${ menu?.position.x }px, ${ menu?.position.y }px)`
      }}
      open={!!menu}
      onOpenChange={(e) => {
        if (!e) {
          setMenu(undefined)
        }
      }}
    >
      {
        ({ Item }) => {

          if (menu?.target.startsWith('model')) {
            return (<>
              <Item className="text-red-500" onClick={(e) => { deleteModelClicked(e, menu.target.split('__')[1]) }}>
                <Trash2 size={16} /> Delete Model
              </Item>
            </>)
          }

          if (menu?.target === "background") {
            return (<>
              <Item onClick={(e) => { createNewModelClicked(e) }}>
                <Plus size={16} /> Create New Model
              </Item>
            </>)
          }
          return <></>
        }
      }
    </Dropdown>
  )
}