import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function useTabFocus() {
  
  const [isTabFocused, setIsTabFocused] = useState(true)

  useEffect(() => {
    function handleFocusEvent() {
      setIsTabFocused(true)
    }
    function handleBlurEvent() {
      setIsTabFocused(false)
    }
    window.addEventListener("focus", handleFocusEvent);
    window.addEventListener("blur", handleBlurEvent);
    return () => {
      window.removeEventListener("focus", handleFocusEvent);
      window.removeEventListener("blur", handleBlurEvent);
    }
  })
  return {
    isTabFocused
  }
}