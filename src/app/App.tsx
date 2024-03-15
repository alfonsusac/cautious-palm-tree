/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { WorkspaceView } from "./WorkspaceView"
import { ZoomDebug } from "./debug"
import { SelectionBox } from "./Selection"
import { Drag } from "./DragContext"
import { ModelList } from "./ModelDataContext"
import { ModelListComponent } from "./ModelList"
import { AppContextMenu } from "./ContextMenu"
import { createContext, useContext, useRef } from "react"
import { Tab } from "./use-active-tab"
import { Mouse } from "./use-mouse3"
import { Viewport } from "./Viewport"
import { useEventListener } from "./use-event-listener"
import UILayer from "./UI"

const App = {
  Mouse,
  Tab,
  viewport: new Viewport,
  drag: new Drag,
  models: new ModelList,
  useHooks() {
    this.viewport.useInit()
    this.drag.useInit()
    this.models.useLocalStorageInitialization()
    // Disables macos trackpad scrolling
    useEventListener('wheel', (e) => { e.preventDefault() }, { passive: false })
  },
}

const AppRefContext = createContext<typeof App>({} as any)
export const useApp = () => useContext(AppRefContext)

export function AppComponent() {
  const app = useRef(App).current
  app.useHooks()
  Mouse.useHooks()
  Tab.useHooks()
  return (
    <AppRefContext.Provider value={app}>
      <UILayer />
      <div className="text-white absolute inset-0 pointer-events-none z-50">
        {/* <ZoomDebug /> */}
      </div>
      <SelectionBox />
      <main className="bg-black h-screen w-screen overflow-hidden" id="background">
        <AppContextMenu />
        <WorkspaceView>
          <ModelListComponent />
        </WorkspaceView>
      </main>
    </AppRefContext.Provider>
  )
}

