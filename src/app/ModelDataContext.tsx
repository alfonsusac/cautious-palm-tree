import { RefObject, useEffect, useRef } from "react"
import { Pos } from "./pos"
import { EventListener, ObservableValue } from "./EventListener"
import { Drag } from "./DragContext"
import { Mouse, MouseEventPayload } from "./use-mouse3"
import { Viewport } from "./Viewport"
import toast from "react-hot-toast"
import { Rect } from "./rect"

export class ModelList {
  list: Model[] = []
  onUpdate = new EventListener<Model[]>

  dragSelectionCoveredModel = new ObservableValue<Model[]>

  useInitialization(drag: Drag, viewport: Viewport) {
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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // const dragSelectionCoveredModel = useRef<Model[]>()
    drag.region.do((region, prev) => {

      if (!prev && region && drag.context.value?.id === "background") {
        this.dragSelectionCoveredModel.value = []
      }

      if (region && drag.context.value?.id === "background") {
        this.list.forEach(model => {
          if (!model.domref) return
          const rect = Rect.fromDOMRect(model.domref?.getBoundingClientRect())
          if (region.isIntersecting(rect)) {
            if (!this.dragSelectionCoveredModel.value?.includes(model)) {
              this.dragSelectionCoveredModel.value?.push(model)
              if (model.selected) {
                this.deselectModel(model)
              } else {
                this.selectModel(model)
              }
            }
          } else {
            if (!Mouse.state?.event.shiftKey) {
              this.deselectModel(model)
            }
            this.dragSelectionCoveredModel.value = this.dragSelectionCoveredModel.value?.filter(m => m.id !== model.id)
          }
        })
      }
    })

    Mouse.onMouseUpdate.do(mouse => {

      const getTopModelUnderMouse = () => {
        const els = mouse.getElementsUnder()
        const topEl = els.find(el => el.getAttribute('data-model'))
        const model = this.get(topEl?.getAttribute('data-model') ?? "")
        return model
      }

      if (mouse.leftClick) {
        // left click down
        const model = getTopModelUnderMouse()

        if (!model) {
          // click on empty space
          if (!mouse.event.shiftKey) {
            this.deselectAll()
          }
        } else {
          // click on node
          if (!mouse.event.shiftKey) {
            if (this.selected.includes(model)) {
              Mouse.onMouseUpdate.doOnce((mouse: MouseEventPayload) => {
                if (mouse.leftRelease) {
                  this.deselectAll()
                  this.selectModel(model)
                }
              })
            } else {
              this.deselectAll()
              this.selectModel(model)
            }
          } else {
            if (!this.selected.includes(model)) {
              this.selectModel(model)
            } else if (this.selected.includes(model)) {
              // on EXACTLY next mouse update, if its leftRelease then deselect.
              Mouse.onMouseUpdate.doOnce((mouse: MouseEventPayload) => {
                if (mouse.leftRelease) {
                  this.deselectModel(model)
                }
              })
            }
          }
        }
      }

      if (drag.context.value?.id === 'background') {
        // Apply selection checking if its dragging on the background.


      } else {
        // Apply drag movement if any only if its not dragging on background
        if (mouse.leftDown && this.selected.some(model => model.id === drag.context.value?.id)) {
          this.selected.forEach(model => {
            model.updatePosition(model.position.add(mouse.positionDelta.scale(viewport.zoom.inversedScale)))
          })
        }

      }

    })
  }

  createModel(position: Pos) {
    this.list.push(new Model(crypto.randomUUID(), position, this))
    this.onUpdate.emit(this.list)
    this.save()
  }
  deleteModel(id: string) {
    const model = this.list.find(m => m.id === id)
    model?.onUpdate.clear() // clears event listener
    this.list = this.list.filter(m => m.id !== id)
    this.onUpdate.emit(this.list)
    this.save()
  }
  get(id: string) {
    return this.list.find(m => m.id === id)
  }
  save() {
    if (this.list.length > 0) { localStorage.setItem('data', JSON.stringify(this.list)) }
  }
  initializeList(models: Model[]) {
    this.list = models
    this.onUpdate.emit(this.list)
  }

  selected: Model[] = []
  selectModel(model: Model) {
    const sel = this.selected.includes(model)
    if (!sel) {
      this.selected.push(model)
      model.onUpdate.emit(model)
    }
  }
  deselectModel(model: Model) {
    const sel = this.selected.includes(model)
    if (sel) {
      this.selected = this.selected.filter(m => m !== model)
      model.onUpdate.emit(model)
    }
  }
  deselectAll() {
    while (this.selected.length) {
      const model = this.selected.pop()
      model?.onUpdate.emit(model)
    }
  }
}

export class Model {
  private _selected: boolean = false;
  domref: HTMLDivElement | null | undefined

  constructor(
    readonly id: string,
    public position: Pos,
    readonly parent: ModelList,
  ) { }
  // onUpdate: (current: Model) => void = () => { }
  onUpdate = new EventListener<Model>
  updatePosition(newPos: Pos) {
    this.position = newPos
    this.onUpdate.emit(this)
    // this.onUpdate(this)
    this.parent?.save()
  }
  // set selected(val: boolean) {
  //   this._selected = val
  //   // this.onUpdate(this)
  //   this.onUpdate.emit(this)
  // }
  get selected() {
    return this.parent.selected.includes(this)
  }

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
