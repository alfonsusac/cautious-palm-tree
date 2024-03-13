import { useEffect, useRef, useState } from "react"
import { Pos } from "./pos"



// export function useModelData() {

//   const updateModelPosition = (id: string, newPos: Pos) => {
//     modelsRef.current.get(id)?.updatePosition(newPos)
//   }

//   const [models, setModels] = useState<Model[]>([])
//   modelsRef.current.onUpdate = (models) => {
//     setModels(models)
//   }

//   // Initialize data from local storage



//   return {
//     models,
//     updateModelPosition,
//   }
// }
