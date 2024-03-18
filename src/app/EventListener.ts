import { useEffect } from "react"

type Handler<T> = (padload: T, prev?: T) => void



export class EventListener<T> {
  handlers: Handler<T>[] = []

  addHandler(handler: Handler<T>) {
    if (!this.handlers.includes(handler)) {
      this.handlers.push(handler)
    } else {
      console.log("Handler Already added to this event listener")
    }
  }
  removeHandler(handler: Handler<T>) {
    if (this.handlers.includes(handler)) {
      this.handlers = this.handlers.filter(h => h !== handler)
      // this.handlers.push(handler)
    }
  }
  doOnce(handler: Handler<T>) {
    const handlerWrapper = (pl: T) => {
      this.removeHandler(handlerWrapper)
      handler(pl)
    }
    this.addHandler(handlerWrapper)
  }
  // Clears all handlers
  clear() {
    this.handlers = []
  }

  emit(payload: T, prev?: T) {
    this.handlers.forEach(h => h(payload, prev))
  }
  do(handler: Handler<T>, deps?: any[]) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      this.addHandler(handler)
      return () => {
        this.removeHandler(handler)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps ?? []])
  }
}

export class ObservableValue<T> extends EventListener<T> {

  private _prevValue: T | undefined
  private _value: T

  constructor()
  constructor(value: T)
  constructor(value?: T) {
    super()
    this._value = value!
  }
  set value(newValue: T) {
    this._value = newValue
    this.emit(this._value, this._prevValue)
    this._prevValue = this._value
  }
  get value() {
    return this._value
  }
  setValue(newValue: T) {
    this.value = newValue
  }
}
