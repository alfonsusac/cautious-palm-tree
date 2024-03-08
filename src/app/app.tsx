"use client"

import { Dropdown } from "@/components/dropdown"
import { Plus } from "lucide-react"
import { Dispatch, RefObject, SetStateAction, createContext, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { useMouse, useZoom } from "./use-mouse"
import { NodeComponent, NodeData } from "./node"
import { Pos } from "./pos"
import Draggable from "react-draggable"
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

export function App() {

  const [dragRef, setDragRef] = useState<null | string>(null)

  const [viewOffset, setViewOffset] = useState(new Pos(0, 0))

  const {
    mousePosition,
    isLeftDragging,
    initialDragPosition,
    isMiddleDragging,
    deltaMousePos
  } = useMouse()

  useEffect(() => {
    if (isMiddleDragging) {
      setViewOffset(prev => prev.add(deltaMousePos.scale(1 / zoomRatio)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMiddleDragging, deltaMousePos])

  const [modal, setModal] = useState<null | {
    screenPos: Pos,
    canvasPos: Pos
  }>(null)


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


  const {
    zoom,
    zoomDelta,
    zoomRatio,
    zoomMousePositionOffset
  } = useZoom()

  useEffect(() => {
    setViewOffset(prev => {
      const newOffsetX = prev.x - zoomMousePositionOffset.x
      const newOffsetY = prev.y - zoomMousePositionOffset.y
      return new Pos(newOffsetX, newOffsetY)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomDelta])


  const canvasRef = useRef<HTMLDivElement>(null)

  const [selections, setSelections] = useState<{
    node: NodeData,
    nodeRef: RefObject<HTMLDivElement>
  }[]>([])


  const [dragging, setIsDragging] = useState<string | null>(null)

  useEffect(() => {
    // toast("Dragging " + isLeftDragging)
    if (!isLeftDragging) {
      setIsDragging(null)
      return
    }
    if (!initialDragPosition) return
    const element = document.elementFromPoint(initialDragPosition.x, initialDragPosition.y)
    const nodeid = element?.getAttribute('data-nodeid') ?? null
    if (!nodeid) return
    // toast(nodeid)
    setIsDragging(nodeid)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeftDragging])

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
      <main className="bg-black h-screen w-screen overflow-hidden *:data-[isdragging=true]:!cursor-grab"
        data-isdragging={isMiddleDragging}
      >

        <CenterDot />
        {/* Canvas */}
        {/* <div
        ref={canvasRef}
        className="bg-neutral-900/50 w-[100vw] h-[100vh] relative border border-white"
        onClick={(e) => {
          var rect = e.currentTarget.getBoundingClientRect()
          setSelections([])
          // toast(`${ rect.left } ${ rect.top }`)
          // setModal({ screenPos: new Pos(e.clientX, e.clientY), canvasPos: new Pos(e.clientX - rect.left, e.clientY - rect.top) })
        }}
        style={{
          transform: `perspective(1px) translateZ(${ zoom }px) translateX(${ viewOffset.x }px) translateY(${ viewOffset.y }px)`,
        }}
        onContextMenu={(e) => {
          e.preventDefault()
        }}
      >
        <Draggable defaultPosition={{ x: 50, y: 50 }} scale={2}>
          <div className="w-20 h-20 bg-red-500">
            Hello
          </div>
        </Draggable>
        {
          models.map(node => {
            return (
              <NodeComponent
                ref={modelsRefList.current[node.id]}
                isDragging={!!(dragging === node.id)}
                key={node.id}
                data={node}
                selected={!!selections.find(n => node.id === n.node.id)}
                onClick={(e, node) => {
                  // toast(JSON.stringify(e.currentTarget.getBoundingClientRect()))
                  // e.preventDefault()
                  // // toast("Test: " + JSON.stringify(selection))
                  // if (e.shiftKey) {
                  //   // toast("ShiftKeys")
                  //   if (selections.find(n => n.node.id === node.id)) {
                  //     setSelections(prev => prev.filter(p => p.node.id !== node.id))
                  //   } else {
                  //     setSelections(prev => [...prev, { node, nodeRef: modelsRefList.current[node.id] }])
                  //   }
                  // } else {
                  //   setSelections([{ node, nodeRef: modelsRefList.current[node.id] }])
                  // }
                }}

              />
            )
          })
        }
      </div> */}
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

        {/* Right Click */}

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
