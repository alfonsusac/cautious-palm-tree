/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { WorkspaceView } from "./WorkspaceView"
import { ZoomDebug } from "./debug"
import { SelectionBox } from "./Selection"
import { Drag, DragContext } from "./DragContext"
import { ModelDataContextProvider } from "./ModelDataContext"
import { ModelListComponent } from "./ModelList"
import { AppContextMenu } from "./ContextMenu"
import { createContext, useContext, useRef } from "react"
import { Tab } from "./use-active-tab"
import { Mouse } from "./use-mouse3"
import { Viewport } from "./Viewport"
import { useEventListener } from "./use-event-listener"

const AppRefContext = createContext<typeof App>({} as any)
export const useApp = () => useContext(AppRefContext)

export function AppComponent() {

  const app = useRef(App).current
  app.useHooks()
  Mouse.useHooks()
  Tab.useHooks()

  return (
    <AppRefContext.Provider value={app}>
      <ModelDataContextProvider>
        <div className="text-white absolute inset-0 pointer-events-none z-50">
          <ZoomDebug />
        </div>
        <SelectionBox />
        <main className="bg-black h-screen w-screen overflow-hidden" id="background">
          <AppContextMenu />
          <WorkspaceView>
            <ModelListComponent />
          </WorkspaceView>
        </main>
      </ModelDataContextProvider>
    </AppRefContext.Provider>
  )
}

const App = {
  Mouse,
  Tab,
  viewport: new Viewport(),
  drag: new Drag(),
  useHooks() {
    this.viewport.useInit()
    this.drag.useInit()
    // Disables macos trackpad scrolling
    useEventListener('wheel', (e) => { e.preventDefault() }, { passive: false })
  }
}