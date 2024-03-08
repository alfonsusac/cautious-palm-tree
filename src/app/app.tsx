"use client"

import { Dispatch, RefObject, SetStateAction, createContext, useEffect, useRef, useState } from "react"
import { useMouse } from "./use-mouse"
import { Pos } from "./pos"
import { Workspace } from "./Workspace"
import { Model } from "./Model"
import { CenterDot, ZoomDebug } from "./debug"
import { SelectionBox } from "./Selection"



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
  selectP1?: Pos,
  selectP2?: Pos,
}>({} as any)

export function App() {

  const [dragRef, setDragRef] = useState<null | string>(null)

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
    <GlobalDragContext.Provider value={{
      dragRef,
      setDragRef,
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
    </GlobalDragContext.Provider>

  )
}
