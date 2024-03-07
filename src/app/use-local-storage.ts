import { useEffect, useState } from "react"

export function useLocalStorage<T>(KEY: string, defaultValue: T) {
  const [val, _setVal] = useState(defaultValue)

  // useEffect(() => {
  //   const ls = localStorage.getItem(KEY)
  //   if (!ls) return
  //   const data = JSON.parse(ls) as T
  //   if (!data) return
  //   _setVal(data.map(item => ({ ...item, position: Pos.fromObject(item.position) })))
  // }, [KEY])

  function setVal(newVal: T) {
    _setVal(prev => {
      localStorage.setItem(KEY, JSON.stringify(newVal))
      return newVal
    })
  }

  return [val, setVal] as const
}