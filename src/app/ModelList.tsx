import { useEffect, useState } from "react"
import { ModelComponent } from "./Model"
// import { Model, useData } from "./ModelDataContext"
import { useApp } from "./App"
import { useRerender } from "./use-rerender"

export function ModelListComponent() {

  const render = useRerender()
  const { models } = useApp()
  models.onUpdate.do(render)

  return (
    <>
      {models.list.map(model => (
        <ModelComponent
          key={model.id}
          data={model}
          onDragEnd={(newpos) => {
            // updateModelPosition(model.id, newpos)
          }}
        />
      ))}
    </>
  )
}