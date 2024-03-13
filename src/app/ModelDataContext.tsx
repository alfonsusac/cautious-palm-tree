import { MutableRefObject, ReactNode, createContext, useContext, useEffect, useRef, useState } from "react"
import { Pos } from "./pos"

export class ModelList {
  models: Model[] = []

  constructor() {
    // const ls = localStorage.getItem('data')
    // if (!ls) return
    // const data = JSON.parse(ls) as Model[]
    // if (!data) return
    // this.initializeList(
    //   data.map(
    //     item => Model.parseJSON(item, this))
    // )
  }
  public onUpdate: (current: Model[]) => void = () => { }

  createModel(position: Pos) {
    this.models.push(new Model(crypto.randomUUID(), position, this))
  }
  get(id: string) {
    return this.models.find(m => m.id === id)
  }
  initializeList(models: Model[]) {
    this.models = models
    this.onUpdate(models)
  }
  save() {
    if (this.models.length > 0) { localStorage.setItem('data', JSON.stringify(this.models)) }
  }

}

export class Model {
  private _selected: boolean = false;

  constructor(
    readonly id: string,
    public position: Pos,
    readonly parent?: ModelList,
  ) { }
  onUpdate: (current: Model) => void = () => { }
  updatePosition(newPos: Pos) {
    this.position = newPos
    this.onUpdate(this)
    this.parent?.save()
  }
  set selected(val: boolean) {
    this._selected = val
    this.onUpdate(this)
  }
  get selected() { return this._selected }

  // JSON Parsing
  toJSON() {
    return {
      id: this.id,
      position: this.position,
    }
  }
  static parseJSON(json: any, parent: ModelList) {
    return new Model(json.id, Pos.fromObject(json.position), parent)
  }
}

const ModelDataContext = createContext<MutableRefObject<ModelList>>({} as any)
export const useDataRef = () => useContext(ModelDataContext)
export const useData = () => useDataRef().current

export function ModelDataContextProvider(props:{ children: ReactNode }) {
  const modelDataRef = useRef(new ModelList)
  useEffect(() => {
    const ls = localStorage.getItem('data')
    if (!ls) return
    const data = JSON.parse(ls) as Model[]
    if (!data) return
    modelDataRef.current.initializeList(
      data.map(
        item => Model.parseJSON(item, modelDataRef.current))
    )
  }, [])
  
  return (
    <ModelDataContext.Provider value={modelDataRef}>
      {props.children}
    </ModelDataContext.Provider>
  )
}