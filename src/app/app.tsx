"use client"

import { Context, Dispatch, RefObject, SetStateAction, createContext, useEffect, useRef, useState } from "react"
import { useMouse } from "./use-mouse"
import { Pos } from "./pos"
import { Workspace } from "./Workspace"
import { Model } from "./Model"
import { CenterDot, ZoomDebug } from "./debug"
import { SelectionBox } from "./Selection"
import { Rect } from "./rect"



type Model = {
  id: string,
  title: string,
  position: Pos
  ref?: RefObject<HTMLDivElement>
}

export const GlobalDragContext = createContext<{
  dragRef: string | null,
  setDragRef: Dispatch<SetStateAction<string | null>>
}>({} as any)

export const GlobalSelectionContext = createContext<{
  region: Rect | null,
  selecting: boolean,
  setSelecting: Dispatch<SetStateAction<boolean>>
  setRegion: Dispatch<SetStateAction<Rect | null>>,
  selection: string[]
  setSelection: (ids: string[]) => void
  clearSelection: () => void,
  addSelection: (ids: string[]) => void,
  removeSelection: (ids: string[]) => void,
  toggleSelection: (ids: string[]) => void
}>({} as any)

type ContextType<C extends Context<any>,> = C extends Context<infer T> ? T : never

export function App() {

  const [dragRef, setDragRef] = useState<null | string>(null)
  const [region, setRegion] = useState<ContextType<typeof GlobalSelectionContext>['region']>(null)
  const [selection, setSelection] = useState<string[]>([])
  const [selecting, setSelecting] = useState(false)

  const clearSelection = () => setSelection([])
  const addSelection = (ids: string[]) => ids.map(id => selection.includes(id) ? null : setSelection(prev => [...prev, id]))
  const removeSelection = (ids: string[]) => ids.map(id => selection.includes(id) ? setSelection(prev => prev.filter(p => p !== id)) : null)
  const toggleSelection = (ids: string[]) => ids.map(id => selection.includes(id) ? setSelection(prev => prev.filter(p => p !== id)) : setSelection(prev => [...prev, id]))

  // MODEL DATA
  const [models, setModels] = useState<Model[]>([])
  const modelsRefList = useRef<{ [key: string]: RefObject<HTMLDivElement> }>({})
  const updateModelPosition = (id: string, newPos: Pos) => {
    setModels(prevNodes => prevNodes.map(prev => prev.id === id ? { ...prev, position: newPos } : prev))
  }
  const addModelPosition = (id: string, newPosOffset: Pos) => {
    setModels(prevNodes => prevNodes.map(prev => prev.id === id ? { ...prev, position: prev.position.add(newPosOffset) } : prev))
  }
  const setModelRef = (id: string, ref: RefObject<HTMLDivElement>) => {
    setModels(prevNodes => prevNodes.map(prev => prev.id === id ? { ...prev, ref } : prev))
  }
  // Initialize data from local storage
  useEffect(() => {
    const ls = localStorage.getItem('data')
    if (!ls) return
    const data = JSON.parse(ls) as Model[]
    if (!data) return
    setModels(data.map(item => ({ ...item, position: Pos.fromObject(item.position) })))
  }, [])
  // Saves data to local storage
  useEffect(() => {
    if (models.length > 0) { localStorage.setItem('data', JSON.stringify(models)) }
  }, [models])
  function createModel(position: Pos) {
    setModels(prev => [...prev, {
      id: crypto.randomUUID(),
      title: `NewModel ${ models.length }`,
      position
    }])
  }

  return (
    <GlobalDragContext.Provider value={{ dragRef, setDragRef }}>
      <GlobalSelectionContext.Provider value={{
        region, setRegion, selection, setSelection, clearSelection, addSelection, removeSelection, toggleSelection,
        selecting, setSelecting
      }}>
        <div className="text-white absolute inset-0 pointer-events-none">
          {!!dragRef + ''} <br />
          {JSON.stringify(dragRef)}
          <ZoomDebug />
        </div>
        <SelectionBox />
        <main className="bg-black h-screen w-screen overflow-hidden">
          <CenterDot />
          <Workspace>
            {
              models.map(model =>
                <Model
                  key={model.id}
                  data={model}
                  onDragEnd={(newpos) => {
                    updateModelPosition(model.id, newpos)
                  }}
                />
              )
            }
          </Workspace>

          {/* Context Menu on Empty Space
      <Dropdown
        className="origin-center fixed w-48"
        style={{
          transform: `translate(${ modal?.screenPos.x }px, ${ modal?.screenPos.y }px)`
        }}
        open={!!modal}
        onOpenChange={(e) => {
          if (!e) setModal(null)
        }}
      >
        {
          ({ Item }) => {
            return (<>
              <Item
                className="gap-1 cursor-pointer"
                onClick={() => {
                  if (modal) {
                    createModel(modal.canvasPos)
                  } else {
                    toast.error("Can't get mouse position relative to canvas (modal undefined) ")
                  }
                }}
              ><Plus size={16} /> Create New Model</Item>
            </>)
          }
        }
      </Dropdown> */}
        </main>
      </GlobalSelectionContext.Provider>
    </GlobalDragContext.Provider >

  )
}
