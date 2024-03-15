import { useEffect, useState } from "react"
import { ModelComponent } from "./Model"
import { Model, useData } from "./ModelDataContext"

export function ModelListComponent() {

  const [models, setModels] = useState<Model[]>([])
  const data = useData()
  data.onUpdate = (models) => {
    console.log("On Update ModelListe? Length:", models)
    setModels([...models])
  }


  // useEffect(() => {
  //   const ls = localStorage.getItem('data')
  //   if (!ls) return
  //   const modellist = JSON.parse(ls) as Model[]
  //   if (!modellist) return
  //   data.initializeList(
  //     modellist.map(
  //       item => Model.parseJSON(item, data))
  //   )
  // }, [data])

  return (
    <>
      {models.map(model => (
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