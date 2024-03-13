import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function useTabFocus() {
  
  const [focused, setFocused] = useState(true)

  useEffect(() => {
    function handleFocusEvent() {
      setFocused(true)
    }
    function handleBlurEvent() {
      setFocused(false)
    }
    window.addEventListener("focus", handleFocusEvent);
    window.addEventListener("blur", handleBlurEvent);
    return () => {
      window.removeEventListener("focus", handleFocusEvent);
      window.removeEventListener("blur", handleBlurEvent);
    }
  })
  return {
    focused
  }
}