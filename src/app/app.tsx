"use client"

import { Context, Dispatch, RefObject, SetStateAction, createContext, useEffect, useRef, useState } from "react"
import { Pos } from "./pos"
import { WorkspaceView } from "./WorkspaceView"
import { ModelComponent } from "./Model"
import { CenterDot, DragDebug, ZoomDebug } from "./debug"
import { SelectionBox } from "./Selection"
import { Rect } from "./rect"
import { DragContext } from "./DragContext"
// import { useModelData } from "./use-model-data"
import { ZoomContext } from "./ZoomContext"
import { ModelDataContextProvider } from "./ModelDataContext"
import { ModelListComponent } from "./ModelList"

export function App() {

  return (
    <ModelDataContextProvider>
      <DragContext>
        <ZoomContext>
          <div className="text-white absolute inset-0 pointer-events-none z-50">
            <DragDebug />
            <ZoomDebug />
          </div>
          <SelectionBox />
          <main className="bg-black h-screen w-screen overflow-hidden" id="background">
            {/* <CenterDot /> */}
            <WorkspaceView>
              <ModelListComponent />
            </WorkspaceView>

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
        </ZoomContext>
      </DragContext>
    </ModelDataContextProvider>
  )
}
