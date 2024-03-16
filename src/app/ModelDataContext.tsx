import { MutableRefObject, ReactNode, createContext, useContext, useEffect, useRef, useState } from "react"
import { Pos } from "./pos"
import { EventListener } from "./EventListener"
import { useApp } from "./App"

export class ModelList {
  list: Model[] = []

  constructor() {

  }
  onUpdate = new EventListener<Model[]>

  useLocalStorageInitialization() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const ls = localStorage.getItem('data')
      if (!ls) return
      const data = JSON.parse(ls) as Model[]
      if (!data) return
      this.initializeList(
        data.map(
          item => Model.parseJSON(item, this))
      )
    }, [])
  }

  createModel(position: Pos) {
    this.list.push(new Model(crypto.randomUUID(), position, this))
    this.onUpdate.emit(this.list)
  }
  deleteModel(id: string) {
    const model = this.list.find(m => m.id === id)
    model?.onUpdate2.clear() // clears event listener
    this.list = this.list.filter(m => m.id !== id)
    this.onUpdate.emit(this.list)
  }
  get(id: string) {
    return this.list.find(m => m.id === id)
  }
  initializeList(models: Model[]) {
    this.list = models
    this.onUpdate.emit(this.list)
  }
  save() {
    if (this.list.length > 0) { localStorage.setItem('data', JSON.stringify(this.list)) }
  }

}

export class Model {
  private _selected: boolean = false;

  constructor(
    readonly id: string,
    public position: Pos,
    readonly parent?: ModelList,
  ) { }
  // onUpdate: (current: Model) => void = () => { }
  onUpdate2 = new EventListener<Model>
  updatePosition(newPos: Pos) {
    this.position = newPos
    this.onUpdate2.emit(this)
    // this.onUpdate(this)
    this.parent?.save()
  }
  set selected(val: boolean) {
    this._selected = val
    // this.onUpdate(this)
    this.onUpdate2.emit(this)
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
