import { useEffect } from "react"

type Handler<T> = (padload: T) => void



export class EventListener<T> {
  handlers: Handler<T>[] = []
  addHandler(handler: Handler<T>) {
    // console.log("Adding handler to event listener. Count:", this.handlers.length)
    if (!this.handlers.includes(handler)) {
      this.handlers.push(handler)
    } else {
      console.log("Handler Already added to this event listener")
    }
  }
  removeHandler(handler: Handler<T>) {
    if (this.handlers.includes(handler)) {
      // console.log("Removing handler to event listener. Count:", this.handlers.length)
      this.handlers = this.handlers.filter(h => h !== handler)
      // this.handlers.push(handler)
    }
  }
  // Clears all handlers
  clear() {
    this.handlers = []
  }

  emit(payload: T) {
    this.handlers.forEach(h => h(payload))
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

  private _value: T

  constructor()
  constructor(value: T)
  constructor(value?: T) {
    super()
    this._value = value!
  }
  set value(newValue: T) {
    this._value = newValue
    this.emit(this._value)
  }
  get value() {
    return this._value
  }
  setValue(newValue: T) {
    this.value = newValue
  }
}
