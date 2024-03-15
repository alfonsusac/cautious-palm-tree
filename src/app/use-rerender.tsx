import { useState } from "react"

export function useRerender() {
  const [val, setVal] = useState({})
  return () => {
    setVal({})
  }
}